const { db } = require("./database");


//=============== RE-INITIALIZE DATABASE ================//

class SyncDB {

    static async run(req, res) {

        try {
            const data = await db.sequelize.sync({ force: true })

            console.log("database synced");
            return true;

        } catch (err) {
            console.error({ message: 'Error synchronizing database:', extra: err.message });
        }
      
    }
}

module.exports = SyncDB;