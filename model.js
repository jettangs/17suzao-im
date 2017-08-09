var Sequelize = require('sequelize')

const User = sequelize.define('user', {
  name: {
    type: Sequelize.STRING(16),
    allowNull:false
  },
  gender: {
    type: Sequelize.INTEGER(1),
    allowNull:false
  },
  cipher: {
    type: Sequelize.STRING(16),
    allowNull:false
  },
  state: {
    type: Sequelize.INTEGER(1),
    allowNull:false
  }
});

const Group = sequelize.define('group', {
  name: {
    type: Sequelize.STRING(16),
    allowNull:false
  },
  number: {
    type: Sequelize.INTEGER(8),
    allowNull:false
  },
  user: {
    type: Sequelize.INTEGER,
    references: {
       model: User,
       key: 'id'
    }
  }
})
const Message = sequelize.define('message', {
  content: {
    type: Sequelize.TEXT,
    allowNull:false
  },
  type: {
    type: Sequelize.INTEGER(1),
    allowNull:false
  },
  receiver:{
    type: Sequelize.INTEGER,
    references: {
       model: User,
       key: 'id'
    }
  }, 
  sender: {
    type: Sequelize.INTEGER,
    references: {
       model: User,
       key: 'id'
    }
  }
}) 
exports.User = User
exports.Group = Group
exports.Message = Message
//User.sync({force:true})
//Group.sync({force:true})
//Message.sync({force:true})
