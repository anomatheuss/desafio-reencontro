const pool = require('./src/config/database');

async function popularBanco() {
  try {
    await pool.query(`
      INSERT INTO pessoas_desaparecidas (nome, idade, descricao, local_desaparecimento, nome_contato, telefone_contato)
      VALUES 
      ('João Silva', 35, 'Vestia camisa azul e calça jeans. Possui tatuagem no braço direito.', 'Bairro Centro', 'Maria Silva', '(51) 99999-1111'),
      ('Ana Oliveira', 60, 'Senhora de cabelos brancos curtos. Usava óculos.', 'Bairro Menino Deus', 'Carlos Oliveira', '(51) 98888-2222');
    `);
    console.log('✅ Pessoas de teste inseridas com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao inserir dados:', error.message);
  } finally {
    process.exit(0);
  }
}

popularBanco();
