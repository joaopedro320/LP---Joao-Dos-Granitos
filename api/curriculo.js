// Trabalhe Conosco | recebe o currículo e guarda no Vercel Blob.
// Devolve { url } para o link ir junto na mensagem de WhatsApp.
// Precisa de um Blob Store (acesso público) conectado ao projeto na Vercel,
// que cria a variável BLOB_READ_WRITE_TOKEN. Sem ela, responde 503 e a LP
// usa o plano B (candidato anexa o currículo direto no WhatsApp).
import { put } from '@vercel/blob';

const LIMITE = 4 * 1024 * 1024; // 4 MB (a Vercel aceita até 4,5 MB por requisição)
const TIPOS = {
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
};

function lerCorpo(req) {
  return new Promise((ok, erro) => {
    const partes = []; let total = 0;
    let estourou = false;
    req.on('data', (c) => {
      if (estourou) return; // continua drenando sem guardar
      total += c.length;
      if (total > LIMITE) { estourou = true; partes.length = 0; erro(Object.assign(new Error('grande'), { status: 413 })); return; }
      partes.push(c);
    });
    req.on('end', () => ok(Buffer.concat(partes)));
    req.on('error', erro);
  });
}

function slug(txt) {
  return String(txt || 'candidato').normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'candidato';
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ erro: 'metodo' }); }
  if (!process.env.BLOB_READ_WRITE_TOKEN) return res.status(503).json({ erro: 'armazenamento-nao-configurado' });

  // Campo isca contra robôs: humanos nunca preenchem.
  if (req.headers['x-isca']) return res.status(400).json({ erro: 'invalido' });

  const tipo = String(req.headers['x-tipo-arquivo'] || '').split(';')[0].trim();
  const ext = TIPOS[tipo];
  if (!ext) return res.status(415).json({ erro: 'tipo' });

  if (Number(req.headers['content-length'] || 0) > LIMITE) return res.status(413).json({ erro: 'grande' });

  let corpo;
  try {
    corpo = Buffer.isBuffer(req.body) ? req.body : await lerCorpo(req);
  } catch (e) {
    return res.status(e.status || 400).json({ erro: e.status === 413 ? 'grande' : 'leitura' });
  }
  if (!corpo.length) return res.status(400).json({ erro: 'vazio' });
  if (corpo.length > LIMITE) return res.status(413).json({ erro: 'grande' });

  // Confere a assinatura do arquivo, não só o tipo declarado.
  const pdf = corpo.subarray(0, 4).toString('latin1') === '%PDF';
  const docx = corpo[0] === 0x50 && corpo[1] === 0x4b;
  const doc = corpo[0] === 0xd0 && corpo[1] === 0xcf;
  if ((ext === 'pdf' && !pdf) || (ext === 'docx' && !docx) || (ext === 'doc' && !doc)) {
    return res.status(415).json({ erro: 'tipo' });
  }

  const nome = slug(decodeURIComponent(String(req.headers['x-nome-candidato'] || '')));
  const data = new Date().toISOString().slice(0, 10);
  try {
    const blob = await put(`curriculos/${data}-${nome}.${ext}`, corpo, {
      access: 'public',
      addRandomSuffix: true,
      contentType: tipo,
    });
    return res.status(200).json({ url: blob.url });
  } catch (e) {
    console.error('curriculo: falha no upload', e && e.message);
    return res.status(502).json({ erro: 'upload' });
  }
}
