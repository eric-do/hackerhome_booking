const db = require('../../db');

exports.getRoom = (req, res) => {
  const query = 'SELECT * FROM bookings.rooms '
                + 'WHERE bookings.rooms.id = $1';
  const { id } = req.params;

  db.query(query, [id], (err, results) => {
    if (err) { return res.status(400).send(err); }
    const room = results.rows[0];
    const formattedRoom = {
      roomname: room.roomname,
      cleaning_fee: room.cleaning_fee,
      id: room.id,
      max_guest: {
        adults: room.adults,
        children: room.children,
        infants: room.infants,
      },
      max_night: room.max_night,
      min_night: room.min_night,
      num_reviews: room.num_reviews,
      price: room.price,
      ratings: room.ratings,
      service_fee: room.service_fee,
      tax: room.tax,
    };
    return res.send(formattedRoom);
  });
};
