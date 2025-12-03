import { useState, type FormEvent } from 'react';
import { Link2, Copy, Check, ArrowRight, Loader2 } from 'lucide-react';

interface ShortenResponse {
  urlOriginal: string;
  hash: string;
  urlEncurtada: string;
}

function App() {
  const [url, setUrl] = useState<string>('');
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleShorten = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShortUrl(null);
    setCopied(false);

    try {
      const response = await fetch('http://localhost:8080/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url }),
      });

      if (!response.ok) throw new Error('Falha ao encurtar URL');

      const data: ShortenResponse = await response.json();
      setShortUrl(data.urlEncurtada);
    } catch (err) {
      setError('Erro ao conectar com o servidor. O backend está rodando?');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (shortUrl) {
      navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      
      {/* Cabeçalho */}
      <div className="mb-8 text-center animate-fade-in">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight flex items-center justify-center gap-2">
          <Link2 className="w-8 h-8 text-indigo-600" />
          Encurtador<span className="text-indigo-600">Pro</span>
        </h1>
        <p className="text-gray-500 mt-2">Sistema desenvolvido por Nicolas Dobbeck</p>
      </div>

      {/* Card Principal */}
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-8 border border-gray-100">
        
        <form onSubmit={handleShorten} className="space-y-4">
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
              Cole sua URL longa
            </label>
            <input
              id="url"
              type="url"
              required
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Processando...
              </>
            ) : (
              <>
                Encurtar Agora <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Erro */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center border border-red-100">
            {error}
          </div>
        )}

        {/* Resultado */}
        {shortUrl && (
          <div className="mt-8">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between gap-3">
              <span className="text-gray-800 font-medium truncate flex-1 select-all">
                {shortUrl}
              </span>
              
              <button
                onClick={copyToClipboard}
                className={`p-2 rounded-lg transition-all ${
                  copied 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-white text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 shadow-sm border border-gray-200'
                }`}
                title="Copiar Link"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-center text-xs text-gray-400 mt-2">
              Clique no botão para copiar
            </p>
          </div>
        )}
      </div>

      <footer className="mt-12 text-gray-400 text-sm">
        Sistema Distribuído • Spring Boot + React TS
      </footer>
    </div>
  );
}

export default App;