const db = require('../db');

exports.getCatalog = (req, res) => {
  db.query('SELECT * FROM vehicles', (err, results) => {
    if (err) return res.status(500).json({ message: 'Erro ao buscar catálogo' });
    res.json(results);
  });
};

exports.getCar = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM vehicles WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Erro ao buscar carro' });
    res.json(results);
  });
};

exports.addCar = (req, res) => {
  const { name, brand, price, kms, description, year, color, images } = req.body;
  db.query('INSERT INTO vehicles (name, brand, price, kms, description, year, color, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [name, brand, price, kms, description, year, color, images], (err) => {
    if (err) return res.status(500).json({ message: 'Erro ao adicionar carro' });
    res.json({ message: 'Carro adicionado' });
  });
};

exports.removeCar = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM vehicles WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ message: 'Erro ao remover carro' });
    res.json({ message: 'Carro removido' });
  });
};
