// routerAdd("POST", "/api/checkAvailability", (c) => {
//   try {
//     let data = $apis.requestInfo(c).data;
//     let deck = data.deck;
//     let shift = data.shift;
//     let date = data.date;
//     let no = data.no;
//     let response = {
//       isAvailable: false,
//       seats: [],
//     };
//     let shared = [];
//     var datas;
//     const result = arrayOf(
//       new DynamicModel({
//         id: "",
//         Appointment: [],
//         field: [],
//         Shared: [],
//       })
//     );

//     $app
//       .dao()
//       .db()
//       .select("id", "Appointment", "field", "Shared")
//       .from("Book")
//       .where($dbx.exp("deck = {:deck}", { deck: deck }))
//       .andWhere($dbx.like("shift", shift))
//       .andWhere($dbx.like("date", date))
//       .all(result);
//     if (result.length == 0) {
//       $app.dao().runInTransaction((txDao) => {
//         const decks = txDao.findFirstRecordByFilter("Deck", "name = {:deck}", {
//           deck: deck,
//         });
//         let dta = JSON.parse(JSON.stringify(decks));
//         const collection = txDao.findCollectionByNameOrId("Book");
//         const book = new Record(collection, {
//           Appointment: JSON.stringify([]),
//           field: JSON.stringify(dta.field),
//           Shared: JSON.stringify([]),
//           deck: deck,
//           date: date,
//           shift: shift,
//         });
//         txDao.saveRecord(book);
//       });
//     }
//     $app.dao().runInTransaction((txDao) => {
//       if (result.length == 0) {
//         txDao
//           .db()
//           .select("id", "Appointment", "field", "Shared")
//           .from("Book")
//           .where($dbx.exp("deck = {:deck}", { deck: deck }))
//           .andWhere($dbx.like("shift", shift))
//           .andWhere($dbx.like("date", date))
//           .all(result);
//       }
//       var rec_data = JSON.parse(JSON.stringify(result));
//       datas = rec_data;
//       if (rec_data[0].field.length == 0 && rec_data[0].shared.length == 0) {
//         response.isAvailable = false;
//         response.seats = [];
//       } else {
//         if (no <= 3) {
//           let seatCheck = rec_data[0].field.filter(
//             (item) =>
//               no <= parseInt(item.maxcapacity) &&
//               3 >= parseInt(item.maxcapacity)
//           );

//           if (seatCheck.length > 0) {
//             response.isAvailable = true;
//             response.seats.push(seatCheck[0].tablename);
//             rec_data[0].field = rec_data[0].field.filter(
//               (item) => item.tablename != seatCheck[0].tablename
//             );
//           } else {
//             if (rec_data[0].shared.length == 0) {
//               let seatCheck = rec_data[0].field.filter(
//                 (item) => 7 == parseInt(item.maxcapacity)
//               );
//               if (seatCheck.length > 0) {
//                 response.isAvailable = true;
//                 response.seats.push(seatCheck[0].tablename);
//                 shared = rec_data[0].field.filter(
//                   (item) => item.tablename == seatCheck[0].tablename
//                 );
//                 shared[0].maxcapacity = 0;
//               }
//             } else {
//               let seatCheck = rec_data[0].shared.filter(
//                 (item) => no <= parseInt(item.rem)
//               );
//               if (seatCheck.length > 0) {
//                 response.isAvailable = true;
//                 response.seats.push(seatCheck[0].tid);
//                 shared = rec_data[0].shared.filter(
//                   (item) => item.tid == seatCheck[0].tid
//                 );
//                 shared[0].rem = parseInt(shared[0].rem) - no;
//               } else {
//                 if (rec_data[0].field.length != 0) {
//                   let seatCheck = rec_data[0].field.filter(
//                     (item) => 7 == parseInt(item.maxcapacity)
//                   );
//                   if (seatCheck.length > 0) {
//                     response.isAvailable = true;
//                     response.seats.push(seatCheck[0].tablename);
//                     shared = rec_data[0].field.filter(
//                       (item) => item.tablename == seatCheck[0].tablename
//                     );
//                     shared[0].maxcapacity =
//                       parseInt(shared[0].maxcapacity) - no;
//                   }
//                 } else {
//                   for (let i = 0; i < rec_data[0].shared.length; i++) {
//                     const sharedSeat = rec_data[0].shared[i];
//                     if (sharedSeat.rem > 0) {
//                       let assignedPersons = Math.min(no, sharedSeat.rem);
//                       sharedSeat.rem =
//                         rec_data[0].shared[i].rem - assignedPersons;
//                       shared.push(sharedSeat);
//                       no -= assignedPersons;
//                       response.seats.push(sharedSeat.tid);
//                       if (no <= 0) {
//                         break;
//                       }
//                     }
//                   }
//                   if (no == 0) {
//                     response.isAvailable = true;
//                   } else {
//                     response.isAvailable = false;
//                     response.seats = [];
//                     shared = [];
//                   }
//                 }
//               }
//             }
//           }
//         } else {
//           let seatCheck = rec_data[0].field.filter(
//             (item) =>
//               no <= parseInt(item.maxcapacity) &&
//               7 == parseInt(item.maxcapacity)
//           );
//           if (seatCheck.length > 0) {
//             response.isAvailable = true;
//             response.seats.push(seatCheck[0].tablename);
//             shared = rec_data[0].field.filter(
//               (item) => item.tablename == seatCheck[0].tablename
//             );
//             shared[0].maxcapacity = 0;
//           } else {
//             let seatCheck = rec_data[0].field.filter(
//               (item) => 3 == parseInt(item.maxcapacity)
//             );
//             if (seatCheck.length > 0) {
//               for (let i = 0; i < seatCheck.length; i++) {
//                 const sharedSeat = seatCheck[i];
//                 if (sharedSeat.maxcapacity > 0) {
//                   let assignedPersons = Math.min(no, sharedSeat.maxcapacity);
//                   sharedSeat.maxcapacity = 0;
//                   shared.push(sharedSeat);
//                   no -= assignedPersons;
//                   response.seats.push(sharedSeat.tablename);
//                   if (no <= 0) {
//                     break;
//                   }
//                 }
//               }
//               if (no == 0) {
//                 response.isAvailable = true;
//               } else {
//                 response.isAvailable = false;
//                 response.seats = [];
//               }
//             } else {
//               let seatCheck = rec_data[0].shared.filter(
//                 (item) => no <= parseInt(item.rem)
//               );
//               if (seatCheck.length > 0) {
//                 response.isAvailable = true;
//                 response.seats.push(seatCheck[0].tid);
//                 shared = rec_data[0].shared.filter(
//                   (item) => item.tid == seatCheck[0].tid
//                 );
//                 shared[0].rem = parseInt(shared[0].rem) - no;
//                 rec_data[0].shared = rec_data[0].shared.filter(
//                   (item) => item.tid != seatCheck[0].tid
//                 );
//               } else {
//                 for (let i = 0; i < rec_data[0].shared.length; i++) {
//                   const sharedSeat = rec_data[0].shared[i];
//                   if (sharedSeat.rem > 0) {
//                     let assignedPersons = Math.min(no, sharedSeat.rem);
//                     sharedSeat.rem =
//                       rec_data[0].shared[i].rem - assignedPersons;
//                     shared.push(sharedSeat);
//                     no -= assignedPersons;
//                     response.seats.push(sharedSeat.tid);
//                     if (no <= 0) {
//                       break;
//                     }
//                   }
//                 }
//                 if (no == 0) {
//                   response.isAvailable = true;
//                 } else {
//                   response.isAvailable = false;
//                   response.seats = [];
//                   shared = [];
//                 }
//               }
//             }
//           }
//         }
//       }
//     });
//     data;
//     return c.json(200, {
//       message: {
//         response: response,
//         sharedData: datas[0].shared,
//         fieldData: datas[0].field,
//       },
//     });
//   } catch (e) {
//     return c.json(500, { message: e });
//   }
// });

routerAdd("POST", "/api/getCount", async (c) => {
  try {
    let data = $apis.requestInfo(c).data;
    let id = data.id;
    const result = arrayOf(
      new DynamicModel({
        id: "",
        total: "",
        percent: "",
      })
    );
    let earned = 0;
    $app
      .dao()
      .db()
      .select("id", "total", "percent")
      .from("Booking")
      .where($dbx.exp("bookedBy = {:id}", { id: id }))
      .all(result);
    for (let i = 0; i < result.length; i++) {
      earned = earned + (result[i].percent * parseFloat(result[i].total)) / 100;
    }

    const result1 = arrayOf(
      new DynamicModel({
        name: "",
        phone: "",
        email: "",
        total: "",
        date: "",
        status: "",
      })
    );
    let withdraw = 0;
    $app
      .dao()
      .db()
      .select("name", "phone", "email", "total", "date", "status")
      .from("Booking")
      .where($dbx.exp("cid = {:id}", { id: id }))
      .all(result1);
    for (let i = 0; i < result1.length; i++) {
      withdraw =
        withdraw + (result[i].percent * parseFloat(result1[i].total)) / 100;
    }
    return c.json(200, {
      message: {
        total: result.length,
        earned: earned,
        array : result1,
        withdraw : withdraw,
      },
    });
  } catch (e) {
    return c.json(500, { message: e });
  }
});
