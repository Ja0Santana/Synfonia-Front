import React, { useState, useEffect } from 'react';
import { ListMusic, Plus, Loader2, Check, AlertCircle } from 'lucide-react';
import { playlistService } from '../../services/playlistService';

const AddToPlaylistMenu = ({ music, onClose }) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToId, setAddingToId] = useState(null);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: string }

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      const data = await playlistService.getAll();
      setPlaylists(data || []);
    } catch (err) {
      console.error('Error fetching playlists:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToPlaylist = async (playlistId) => {
    setAddingToId(playlistId);
    setStatus(null);
    try {
      const musicData = {
        trackId: music.id || music.trackId,
        nome: music.nome,
        artista: music.artista,
        album: music.album,
        capaUrl: music.capaUrl,
        previewUrl: music.url || music.previewUrl,
        uri: music.uri || music.trackUri,
        source: music.source || 'LOCAL'
      };

      await playlistService.addTrack(playlistId, musicData);
      setStatus({ type: 'success', message: 'Música adicionada!' });
      setTimeout(() => {
        if (onClose) onClose();
      }, 1500);
    } catch (err) {
      console.error('Error adding track to playlist:', err);
      setStatus({ type: 'error', message: 'Erro ao adicionar música.' });
      setTimeout(() => setStatus(null), 3000);
    } finally {
      setAddingToId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="w-[280px] md:max-w-sm glass-panel border border-white/10 rounded-2xl shadow-2xl p-1.5 md:p-2 animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
      <div className="p-2 md:p-3 border-b border-white/5 mb-1">
        <h4 className="text-[9px] md:text-xs font-bold text-dim uppercase tracking-tight md:tracking-widest whitespace-nowrap overflow-hidden text-ellipsis">Adicionar à Playlist</h4>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-5 h-5 text-brand animate-spin" />
        </div>
      ) : playlists.length > 0 ? (
        <div className="max-h-48 overflow-y-auto space-y-1 custom-scrollbar">
          {playlists.map((playlist) => (
            <button
              key={playlist.id}
              onClick={() => handleAddToPlaylist(playlist.id)}
              disabled={addingToId !== null}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all group text-left px-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <ListMusic className="w-4 h-4 text-dim group-hover:text-brand" />
                <span className="text-xs md:text-sm text-main truncate font-medium group-hover:text-brand">
                  {playlist.nome}
                </span>
              </div>
              
              {addingToId === playlist.id ? (
                <Loader2 className="w-3 h-3 text-brand animate-spin" />
              ) : (
                <Plus className="w-3 h-3 text-dim opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </button>
          ))}
        </div>
      ) : (
        <div className="p-4 text-center">
          <p className="text-xs text-zinc-600 italic">Você não tem playlists.</p>
        </div>
      )}

      {status && (
        <div className={`mt-2 p-2 rounded-xl text-[10px] font-bold flex items-center gap-2 animate-in slide-in-from-bottom-2 ${
          status.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
        }`}>
          {status.type === 'success' ? <Check size={12} /> : <AlertCircle size={12} />}
          {status.message}
        </div>
      )}
      </div>
    </div>
  );
};

export default AddToPlaylistMenu;
