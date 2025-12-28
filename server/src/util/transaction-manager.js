import pool from '../config/database.js';

/**
 * Transaction Manager - Veritabanı transaction yönetimi için yardımcı sınıf
 * Service katmanında kullanılır, Repository'ler transaction client'ı alır
 */
export default class TransactionManager {
  /**
   * Transaction içinde çalışacak bir callback fonksiyonunu çalıştırır
   * @param {Function} callback - Transaction içinde çalışacak async fonksiyon (client parametresi alır)
   * @returns {Promise} - Callback'in döndürdüğü değer
   */
  async execute(callback) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Callback fonksiyonunu transaction client ile çalıştır
      const result = await callback(client);
      
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Manuel transaction yönetimi için client döndürür
   * Daha fazla kontrol gerektiğinde kullanılabilir
   * @returns {Promise<Object>} - Transaction client
   */
  async begin() {
    const client = await pool.connect();
    await client.query('BEGIN');
    return client;
  }

  /**
   * Transaction'ı commit eder ve client'ı serbest bırakır
   * @param {Object} client - Transaction client
   */
  async commit(client) {
    try {
      await client.query('COMMIT');
    } finally {
      client.release();
    }
  }

  /**
   * Transaction'ı rollback eder ve client'ı serbest bırakır
   * @param {Object} client - Transaction client
   */
  async rollback(client) {
    try {
      await client.query('ROLLBACK');
    } finally {
      client.release();
    }
  }
}
