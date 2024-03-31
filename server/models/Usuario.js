module.exports = (sequelize, DataTypes) => {
  let Usuario = sequelize.define(
    "Usuario",
    {
      email: {
        type: DataTypes.STRING(255),
        primaryKey: true,
        allowNull: false,
      },
      nome: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      funcao: {
        type: DataTypes.STRING(255),
      },
      github: {
        type: DataTypes.STRING(255),
      },
      linkedin: {
        type: DataTypes.STRING(255),
      },
      cep: {
        type: DataTypes.STRING(8),
      },
      cep_numEnd: {
        type: DataTypes.INTEGER,
      },
      cep_complemento: {
        type: DataTypes.STRING(255),
      },
      status: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        /**
         * 1 - Usuário novo (cadastro incompleto)
         * 2 - Admin novo (cadastro incompleto)
         * 3 - Usuário validado (cadastro completo)
         * 4 - Admin validado (cadastro completo)
         * !! 5 - Usuário inativo *NOVO
         */
      },

      dtInat: { type: DataTypes.DATE },
    },
    {
      tableName: "usuario",
      schema: "3x",
    }
  );

  return Usuario;
};
