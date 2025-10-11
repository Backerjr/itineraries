const express = require('express');
const path = require('path');
const fs = require('fs/promises');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const KEY_FILE = path.join(DATA_DIR, 'gemini-key.json');
const STATIC_ROOT = path.join(__dirname);

app.use(express.json({ limit: '2kb' }));

const ensureDataDir = async () => {
  await fs.mkdir(DATA_DIR, { recursive: true });
};

const readStoredKey = async () => {
  try {
    const contents = await fs.readFile(KEY_FILE, 'utf8');
    const parsed = JSON.parse(contents);
    const key = typeof parsed?.key === 'string' ? parsed.key.trim() : '';
    return key;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return '';
    }
    throw error;
  }
};

const writeStoredKey = async (key) => {
  await ensureDataDir();
  const payload = JSON.stringify({ key }, null, 2);
  await fs.writeFile(KEY_FILE, payload, 'utf8');
};

const deleteStoredKey = async () => {
  try {
    await fs.unlink(KEY_FILE);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
};

app.get('/api/gemini-key', async (_req, res) => {
  try {
    const key = await readStoredKey();
    if (!key) {
      return res.status(204).end();
    }

    return res.json({ key });
  } catch (error) {
    console.error('Failed to read stored Gemini API key:', error);
    return res.status(500).send('Failed to read stored API key.');
  }
});

app.post('/api/gemini-key', async (req, res) => {
  try {
    const { key } = req.body || {};
    if (typeof key !== 'string' || !key.trim()) {
      return res.status(400).send('A non-empty API key is required.');
    }

    const sanitizedKey = key.trim();

    if (sanitizedKey.length > 256) {
      return res.status(400).send('The API key appears to be invalid.');
    }

    await writeStoredKey(sanitizedKey);

    return res.status(204).end();
  } catch (error) {
    console.error('Failed to store Gemini API key:', error);
    return res.status(500).send('Failed to store the API key.');
  }
});

app.delete('/api/gemini-key', async (_req, res) => {
  try {
    await deleteStoredKey();
    return res.status(204).end();
  } catch (error) {
    console.error('Failed to delete Gemini API key:', error);
    return res.status(500).send('Failed to remove the stored API key.');
  }
});

app.use((req, res, next) => {
  const requestPath = req.path;
  if (requestPath === '/data' || requestPath === '/data/' || requestPath.startsWith('/data/')) {
    return res.status(404).send('Not Found');
  }

  return next();
});

app.use(express.static(STATIC_ROOT));

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
