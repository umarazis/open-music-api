const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistSong({ playlistId, songId }) {
    const id = `playlist_song-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan ke playlist');
    }

    return result.rows[0].id;
  }

  async getPlaylistSongsByPlaylistId(playlistId) {
    const query = {
      text: 'SELECT songs.id, songs.title, songs.performer FROM playlist_songs LEFT JOIN songs ON playlist_songs.song_id=songs.id WHERE playlist_id = $1',
      values: [playlistId],
    };
    const result = await this._pool.query(query);

    return result.rows;
  }

  async deletePlaylistSong({ playlistId, songId }) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Lagu gagal dihapus dari playlist');
    }
  }
}

module.exports = PlaylistSongsService;
