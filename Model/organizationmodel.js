const pool = require('./postgressdb')

async function organizationmodel (data){
    const{
        firstName,
    lastName,
    email,
    phoneNumber,
    companyName,
    companyAddress,
    companyRegistrationNumber,
    companyPhoneNumber,
    companySize,
    industry,
    hiringForWhichPosition,
    numberOfHiring,
    jobDescription
    }= data;
    const query  = `
    INSERT INTO ORGANIZATION
    (firstname, lastname, email, phonenumber, companyname, companyaddress,
       comapnyregistrationnumber, companyphonenumber, comapnysize, industry,
       hiringforwhichposition, numberofhiring, jobdescription)
        VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
    RETURNING *;
    `;

    const values = [
    firstName || null,
    lastName || null,
    email,
    phoneNumber || null,
    companyName || null,
    companyAddress || null,
    companyRegistrationNumber || null,
    companyPhoneNumber || null,
    companySize !== undefined ? companySize : null,
    industry || null,
    hiringForWhichPosition || null,
    numberOfHiring !== undefined ? numberOfHiring : null,
    jobDescription || null
  ];

  const {rows} = await pool.query(query,values);
  return rows[0];
}
module.exports={
    organizationmodel
}


// Your model talks to PostgreSQL, and database operations are ALWAYS asynchronous.
// Model — because it defines how you talk to the database (table/schema + DB query functions). Other layers depend on it



// Explain line-by-line (summary):

// Destructure data for clarity.

// Use parameterized query ($1, $2, ...) to prevent SQL injection.

// Provide default null for optional fields.

// RETURNING * gives the inserted row back so controller can return it to client.

// Export the function for controller to use.