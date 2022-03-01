const got = require('got');

export default async function handler(req, res) {
  const {
    leagueName = 'Standard',
    itemName = "Rigwald's Quills",
    // minPrice = 0,
    // maxPrice = 0,
    // isCorrupted = false,
    // gemLevel = 0,
  } = req.body;

  const SortConfig = {
    price: 'asc',
  };

  const defaults = {
    filters: {
      /* misc_filters: {
        disabled: true,
        filters: {
          corrupted: {
            options: isCorrupted,
          },
          gem_level: {
            min: gemLevel || null,
          },
        },
      }, */
      /* trade_filters: {
        filters: {
          price: {
            min: parseInt(minPrice, 10) || null,
            max: parseInt(maxPrice, 10) || null,
          },
        },
      }, */
    },
    term: itemName,
    stats: [{ type: 'and', filters: [] }],
    status: { option: 'onlineleague' },
  };

  const o = {
    url: `https://www.pathofexile.com/api/trade/search/${leagueName}`,
    method: 'POST',
    responseType: 'json',
    json: {
      query: defaults,
      sort: SortConfig,
    },
  };

  try {
    const { body } = await got(o);
    const { id } = body;

    res
      .status(200)
      .redirect(301, `https://www.pathofexile.com/trade/search/${leagueName}/${id}`);
  } catch (e) {
    res
      .status(500)
      .json({ error: e.message });
  }
}
