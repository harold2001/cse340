const pool = require('../database/');

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query(
    'SELECT * FROM public.classification ORDER BY classification_name'
  );
}

async function getClassificationNameById(params) {
  const data = await pool.query(
    'SELECT classification_name FROM public.classification WHERE classification_id = $1',
    [params]
  );
  return data.rows[0]?.classification_name;
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error('getclassificationsbyid error ' + error);
  }
}
/* ***************************
 *  Get inventory data by item_id
 * ************************** */
async function getInventoryByItemId(item_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory
      WHERE inv_id = $1`,
      [item_id]
    );
    return data.rows[0];
  } catch (error) {
    console.error('getinventorybyitemid error ' + error);
  }
}

async function createNewClassification(classification_name) {
  try {
    const sql =
      'INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *';
    return await pool.query(sql, [classification_name]);
  } catch (error) {
    console.error('createnewclassification error ' + error);
  }
}

async function createNewInventory(
  classification_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color
) {
  try {
    const sql =
      'INSERT INTO public.inventory (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *';
    return await pool.query(sql, [
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
    ]);
  } catch (error) {
    console.error('createnewinventory error ' + error);
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryByItemId,
  createNewClassification,
  getClassificationNameById,
  createNewInventory,
};
