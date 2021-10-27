
// https://mybankstatement.net/TP/api/RequestStatement

const apiConfig = process.env.apiConfig;

export default async (req, res) => {
    
    if(req.method === 'POST') {

          try {
            const apiResponse = await fetch('https://mybankstatement.net/TP/api/RequestStatement',
            {
                method: 'POST',
                body: JSON.stringify(req.body),
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                  'Content-Type': 'application/json',
                  Accept: '*/*',
                  'Client-ID': apiConfig['Client-ID'],
                  'Client-Secret': apiConfig['Client-Secret'],
                },
              }
            )

            const resBody = await apiResponse.json();
            res.statusCode = apiResponse.status
            res.json(resBody)
            return;
          } catch (error) {
            res.json(error)
          }
    }
}