// @ts-check

export default async (app, options) => {
  // Главная страница
  app.get('/', (req, res) => {
    const templateData = {
     
    };
    res.view('index', templateData);
  });
};

