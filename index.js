// callbacks
// buscar una api
// tres solicitudes anidadas
const request = require('request'); // n librerias que hacen lo mismo

const options = {
  uri: 'https://api.github.com/gists', // 'https://api.github.com/users/mabel2k16/repos',
  headers: {
    'User-Agent': 'Awesome-Octocat-App',
  },
};
// revisar todos los codigos http 200, 400, 404, 401, 403, 500, 201

request.get(options, (error, response, body) => {
  if (error) {
    return console.log(error);
  }
  const repositorios = JSON.parse(body);
  console.log((repositorios[7].owner));
  console.log((repositorios[7].owner.login));
  const loginBuscado = repositorios[7].owner.login; // https://api.github.com/repos/mabel2k16/carritom/branches
  console.log(loginBuscado);
  const options2 = {
    uri: `https://api.github.com/users/${loginBuscado}/repos`,
    headers: {
      'User-Agent': 'Awesome-Octocat-App',
    },
  };

  request.get(options2, (error2, response2, body2) => {
    if (error2) {
      return console.log(error2);
    }
    const repositorio = JSON.parse(body2);
    console.log('REPOSITORIO ', repositorio);
    if (Object.keys(repositorio).length > 0) {
      repositorio.forEach((element) => {
        console.log('Nombre repositorio: ', element.name, 'Descripcion: ', element.description);
      });
      const nomRepositorio = repositorio[0].name;
      console.log(nomRepositorio);
      const options3 = { // https://api.github.com/repos/{owner}/{repo}/branches
        uri: `https://api.github.com/repos/${loginBuscado}/${nomRepositorio}/branches`,
        headers: {
          'User-Agent': 'Awesome-Octocat-App',
        },
      };

      request.get(options3, (error3, response3, body3) => {
        if (error3) {
          return console.log(error3);
        }
        const repositorio3 = JSON.parse(body3);
        if (Object.keys(repositorio3).length > 0) {
          console.log(repositorio3);
        } else {
          return console.log('Repositorio: ', nomRepositorio, 'Sin branches');
        }
      });
    } else {
      return console.log(loginBuscado, 'Sin repositorios');
    }
  });
});
