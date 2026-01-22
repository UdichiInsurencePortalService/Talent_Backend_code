const pool = require('./postgressdb')

async function testtakerdemo(data) {
 const{   
  firstname,
  lastname,
  email,
  phonenumber
 } = data;

 const query = `
  INSERT INTO TESTTAKER
  (firstname,lastname,email,phonenumber)
  VALUES
  ($1,$2,$3,$4)
      RETURNING *;
`

  const values = [
    firstname || null,
    lastname || null,
    email ,
    phonenumber || null
  ]
  const rows = await pool.query(query,values);
   return rows[0]

}
module.exports={
    testtakerdemo
}