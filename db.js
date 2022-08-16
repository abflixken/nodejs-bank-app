const { Client } = require("pg");

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "db",
  password: "clarkent",
  port: 5432,
});

client.connect((err) => {
  if (err) {
    console.log(`error`);
    return;
  }
  console.log(`connected`);
});
// create account -- acct name, acc id, balance

const createNewAccount = ({ acId, acNm, balance }, onCreate = undefined) => {
  client.query(
    `insert into account values ( $1, $2, $3)`,
    [acId, acNm, balance],
    (err, res) => {
      if (err) console.log(`\n problem in creating customer`);
      else {
        console.log(`\n New Customer Created Successfully`);
        if(onCreate) onCreate(`New Customer Created Successfully`)
      }
    }
  );
};

const withdraw = ({ acId, amount }, onWithdraw = undefined) => {
  client.query(
    `select balance from account where ac_id = $1`,
    [acId],
    (err, res) => {
      if (err) {
        console.log(`\n problem in withdrawing`);
      } else {
        const balance = parseFloat(res.rows[0].balance);

        const newBalance = balance - amount;

        client.query(
          `update account set balance = $1 where ac_id = $2`,
          [newBalance, acId],
          (err, res) => {
            if (err) console.log(`\n problem in withdrawing`);
            else {
              console.log(`\n amount ${amount} withdrawn successfully`);
              if(onWithdraw) onWithdraw(`amount ${amount} withdrawn successfully`)
            }
          }

        );
      }
    }
  );
};

const deposit = ({ acId, amount }, onDeposit = undefined) => {
  client.query(
    `select balance from account where ac_id = $1`,
    [acId],
    (err, res) => {
      if (err) {
        console.log(`\n problem in depositing`);
      } else {
        const balance = parseFloat(res.rows[0].balance);
        const newBalance = balance + amount;

        client.query(
          `update account set balance = $1 where ac_id = $2`,
          [newBalance, acId],
          (err, res) => {
            if (err) console.log(`\n problem in depositing`);
            else {
              console.log(`\n amount ${amount} deposited successfully`);
              if(onDeposit) onDeposit(`amount ${amount} deposited successfully`)

            }
          }
        );
      }
    }
  );
};

const transfer = ({ srcId, destId, amount }, onTransfer = undefined) => {
  withdraw({ acId: srcId, amount },msgWd => {

  });

  deposit({ acId: destId, amount }, msgDp => {
    if(onTransfer) onTransfer(`Amount ${amount} Transferred successfully`)

  });
};

const balance = (acId, onBalance = undefined) => {
  client.query(
    `select balance from account where ac_id = $1`,
    [acId],
    (err, res) => {
      if (err) {
        console.log(`\n problem in fecting the balance`);
      } else {
        const balance = parseFloat(res.rows[0].balance);
        console.log(`\n your account balance is ${balance}`)
        if(onBalance) onBalance(balance)
      }
    }
  );
};

module.exports = {
  createNewAccount,
  deposit,
  withdraw,
  transfer,
  balance 
};
