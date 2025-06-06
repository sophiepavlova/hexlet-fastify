// @ts-check

export default async (app, options) => {
  // Главная страница
  app.get('/', (req, res) => {
    const templateData = {
     
    };
    res.view('index', templateData);
  });
};
// export default async function (fastify, opts) {
//   fastify.get('/', async function (request, reply) {
//     // return 'Hello'
//     return { root: true }
//   })
// }
