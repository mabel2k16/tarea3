// callbacks
// buscar una api
// tres solicitudes anidadas
const request = require('request'); // n librerias que hacen lo mismo

const verTodosGits = () => {
  const options = {
    uri: 'https://api.github.com/gists', // 'https://api.github.com/users/mabel2k16/repos',
    headers: {
      'User-Agent': 'Awesome-Octocat-App',
    },
  };
  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (error) {
        return reject(error);
      }
      const repositorios = JSON.parse(body);
      return resolve(repositorios);
    });
  });
};

const seleccionarPropiedadesImportantes = element => ({
  name: element.name,
  description: element.description,
});

const repositorioRequest = (loginBuscado) => {
  const options2 = {
    uri: `https://api.github.com/users/${loginBuscado}/repos`,
    headers: {
      'User-Agent': 'Awesome-Octocat-App',
    },
  };
  return new Promise((resolve, reject) => {
    request(options2, (error2, response2, body2) => {
      if (error2) {
        return reject(error2);
      }
      const respuestaJson = JSON.parse(body2);
      return resolve(respuestaJson);
    });
  });
};

const branchRequest = (duenio, nomRepositorio) => {
  const options3 = {
    uri: `https://api.github.com/repos/${duenio}/${nomRepositorio}/branches`,
    headers: {
      'User-Agent': 'Awesome-Octocat-App',
    },
  };
  return new Promise((resolve, reject) => {
    request(options3, (error3, response3, body3) => {
      if (error3) {
        return reject(error3);
      }
      const respuestaJson = JSON.parse(body3);
      return resolve(respuestaJson);
    });
  });
};
let loginDuenio;
let nomRepositorio;

verTodosGits()
  .then((repositorios) => {
    loginDuenio = repositorios[7].owner.login;
    return repositorioRequest(loginDuenio);
  })
  .then((repositorio) => {
    if (Object.keys(repositorio).length > 0) {
      // repositorio.forEach((element) => {
      //   console.log('Nombre repositorio FIX:  ', element.name, 'Descripcion: ', element.description);
      // });
      const resultados = repositorio.map(seleccionarPropiedadesImportantes);
      console.log(' REPOSITORISO DE ', loginDuenio, '======================');
      console.log(resultados);
      console.log('========================================================');
      nomRepositorio = repositorio[0].name;
      return branchRequest(loginDuenio, nomRepositorio);
    }
    return Promise.reject(new Error('sin repositorios'));
  })
  .then((respuesta) => {
    if (Object.keys(respuesta).length > 0) {
      console.log(' BRANCH DEL REPOSITORIO ', nomRepositorio, '======================');
      console.log(respuesta);
      console.log('==================================================================');

      return Promise.resolve(respuesta);
    }
    return Promise.reject(new Error('Repositorio: ', nomRepositorio, 'Sin branches'));
  })
  .catch((err) => {
    return Promise.reject(err);
  });
