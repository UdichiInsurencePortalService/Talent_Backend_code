const pool = require('./postgressdb');

async function demosubmission(data) {
    const{
        duration_seconds,
        canceled,
        score,
        total,
    }=data;

    const query = `
    
   INSERT INTO demo_submission(
   duration_seconds,canceled,score,total
   )VALUES
   ($1,$2,$3,$4)

   RETURNING *;
`
const values = [
    duration_seconds || null,
    canceled || null,
    score,
    total

]
const result = await pool.query(query,values);
return result.rows[0]

}

module.exports={
    demosubmission
}