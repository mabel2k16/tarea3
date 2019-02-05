const rp = require('request-promise');

// pending

// resolved
// reject
const options = {
  uri: 'https://api.github.com/gists',
  json: true,
  headers: {
    'User-Agent': 'Awesome-Octocat-App',
  },
};

const seleccionarPropiedadesImportantes = element => ({
  name: element.name,
  description: element.description,
});
let loginDuenio;
let nomRepositorio;

rp(options)
  .then((gists) => {
    if (Array.isArray(gists)
            && gists[7] !== undefined
            && gists[7].owner !== undefined
            && gists[7].owner.login !== undefined) {
      loginDuenio = gists[7].owner.login;
      return rp({
        uri: `https://api.github.com/users/${loginDuenio}/repos`,
        json: true,
        headers: {
          'User-Agent': 'Awesome-Octocat-App',
        },
      });
    }
    return Promise.reject(new Error('No existen datos'));
  })
  .then((repositorio) => {
    if (Object.keys(repositorio).length > 0) {
      const resultados = repositorio.map(seleccionarPropiedadesImportantes);
      console.log('== REPOSITORISO DE ', loginDuenio, '======================');
      console.log(resultados);
      nomRepositorio = repositorio[0].name;
      return rp({
        uri: `https://api.github.com/repos/${loginDuenio}/${nomRepositorio}/branches`,
        json: true,
        headers: {
          'User-Agent': 'Awesome-Octocat-App',
        },
      });
    }
    return Promise.reject(new Error(loginDuenio, 'sin repositorios'));
  })
  .then((respuesta) => {
    if (Object.keys(respuesta).length > 0) {
      console.log('== BRANCH DEL REPOSITORIO ', nomRepositorio, '======================');
      console.log(respuesta);
      return Promise.resolve(respuesta);
    }
    return Promise.reject(new Error('Repositorio: ', nomRepositorio, 'Sin branches'));
  })
  .catch((err) => {
    console.log('error', err);
    return Promise.reject(err);
  });
