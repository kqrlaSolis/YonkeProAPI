import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import { sendMesssage } from "./nose/whatsappService.js";

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("SI SIRVEEEEE");
});

/////ADMIN/////

app.get("/admins", async (req, res) => {
  const dataBase = new PrismaClient();
  const admins = await dataBase.admin.findMany();

  res.json(admins);
});

//FIND ADMIN BY ID

app.get("/admins/:id", async (req, res) => {
  const dataBase = new PrismaClient();
  const { id } = req.params;

  const admin = await dataBase.admin.findUnique({
    where: {
      id: Number(id),
    },
  });

  res.json(admin);
});

//CREATE NEW ADMIN
app.post("/admins", async (req, res) => {
  const dataBase = new PrismaClient(); // instancia de la clase PrismaClient
  const admins = req.body; // Suponemos que el cuerpo contiene un array de objetos admins

  try {
    const newAdmins = await dataBase.admin.createMany({
      data: admins, // `data` debe ser un array de objetos con la estructura de cada admin
    });

    res.status(201).json({
      message: "Admins creados exitosamente",
      count: newAdmins.count, // `count` muestra cuántos registros se crearon
    });
  } catch (error) {
    console.error("Error creando admins:", error);
    res.status(500).json({
      message: "Error al crear admins",
      error: error.message,
    });
  }
});

// app.post("/admins", async (req, res) => {
//   const dataBase = new PrismaClient(); //intancia de la clase PrismaClient
//   const bodyAdmin = req.body;

//   const newAdmin = await dataBase.admin.create({
//     data: {
//       name: bodyAdmin.name,
//       phone: bodyAdmin.phone,
//     },
//   });

//   res.json(newAdmin);
// });

//UPDATE ADMIN

app.put("/admins/:id", async (req, res) => {
  const dataBase = new PrismaClient();
  const body = req.body;
  const { id } = req.params;

  const editedAdmin = await dataBase.admin.update({
    where: {
      id: Number(id),
    },
    data: {
      name: body.name,
      phone: body.phone,
    },
  });

  res.json(editedAdmin);
});

//DELETE ADMIN

app.delete("/admins/:id", async (req, res) => {
  const dataBase = new PrismaClient();
  const { id } = req.params;

  const deletedAdmin = await dataBase.admin.delete({
    where: {
      id: Number(id),
    },
  });
  res.json(deletedAdmin);
});

/////YONKE/////

app.get("/yonkes", async (req, res) => {
  const dataBase = new PrismaClient();
  const yonkes = await dataBase.yonke.findMany();

  res.json(yonkes);
});

//FIND yonke BY ID

app.get("/yonkes/:id", async (req, res) => {
  const dataBase = new PrismaClient();
  const { id } = req.params;

  const yonke = await dataBase.yonke.findUnique({
    where: {
      id: Number(id),
    },
  });

  res.json(yonke);
});

//CREATE NEW YONKE

app.post("/yonkes", async (req, res) => {
  const dataBase = new PrismaClient(); //intancia de la clase PrismaClient
  const body = req.body;

  if (!body.admin_id) return res.json({ message: "no hay" });

  const newYonke = await dataBase.yonke.create({
    data: {
      name: body.name,
      location: body.location,
      city: body.city,
      latitude: body.latitude,
      longitude: body.longitude,
      admin_id: body.admin_id,
    },
  });

  await dataBase.admin_yonke.create({
    data: {
      admin_id: body.admin_id,
      yonke_id: newYonke.id,
    },
  });
  res.json(newYonke);
});

//UPDATE YONKE

app.put("/yonkes/:id", async (req, res) => {
  const dataBase = new PrismaClient();
  const body = req.body;
  const { id } = req.params;

  const editedYonke = await dataBase.yonke.update({
    where: {
      id: Number(id),
    },
    data: {
      name: body.name,
      location: body.location,
      city: body.city,
      latitude: body.latitude,
      longitude: body.longitude,
    },
  });

  res.json(editedYonke);
});

//DELETE YONKE

app.delete("/yonkes/:id", async (req, res) => {
  const dataBase = new PrismaClient();
  const { id } = req.params;

  const deletedYonke = await dataBase.yonke.delete({
    where: {
      id: Number(id),
    },
  });
  res.json(deletedYonke);
});

//ALL ADMINS BY YONKE_ID

app.get("/admins/by-yonke/:yonke_id", async (req, res) => {
  const dataBase = new PrismaClient();
  const { yonke_id } = req.params;

  const admin = await dataBase.admin_yonke.findUnique({
    where: {
      yonke_id: Number(yonke_id),
    },
    include: {
      admin: true,
    },
  });

  if (!admin) {
    return res
      .status(404)
      .json({ message: "ADMIN NOT FOUND FOR THIS YONKE_ID" });
  }
  res.json(admin.admin);
});

//ALL YONKES BY ADMIN ID

app.get("yonkes/by-admin/:admin_id", async (req, res) => {
  const dataBase = new PrismaClient();
  const { admin_id } = req.params;

  const yonkes = await dataBase.admin_yonke.findMany({
    where: {
      admin_id: Number(admin_id),
    },
    include: {
      yonke: true,
    },
  });
  if (yonkes.length === 0) {
    return res
      .status(404)
      .json({ message: "NO YONKES FOUND FOR THIS ADMIN_ID" });
  }
  res.json(yonkes.map((entry) => entry.yonke));
});


app.post("/question", async (req, res) => {
  const dataBase = new PrismaClient();
  const {cities, name, phoneNumber, pieceName, carBrand, carModelYear, carEngine} = req.body;
  console.log("------------------------", cities , "------------------------");
  let admins = []
  const yonkes = await dataBase.yonke.findMany({
    where: {
      city: {
        in: cities
      }
    },
    include: {
      admin_yonkes: {
        include: {admin: true}
      }
    }
  })

  const response = yonkes.map((yonke)=>{
    const yonkemap = {
      name: yonke.name,
      location: yonke.location,
      city: yonke.city,
      latitude: yonke.latitude,
      longitude: yonke.longitude,
      admins: yonke.admin_yonkes.map((admin)=>{
        const adminmap = {
          name: admin.admin.name,
          phone: admin.admin.phone
        }
        admins.push(adminmap)
        return adminmap;
      })
    }
    console.log(admins);
    return yonkemap;
  })

  await admins.map(async(admin)=>{
    const message = `
    👋 Hola ${admin.name}, 
    
    📌 *Nueva solicitud recibida*:
      
    - 🧑‍💼 *Cliente*: ${name}  
    - 📞 *Teléfono*: ${phoneNumber}  
    - 🏙️ *Ciudad*: ${cities}  
    
    📄 *Detalles de la solicitud*:  
    - 🔧 *Pieza requerida*: ${pieceName}  
    - 🚗 *Marca del auto*: ${carBrand}  
    - 📆 *Modelo/Año*: ${carModelYear}  
    - ⚙️ *Motor*: ${carEngine}  
    
    Por favor, responde a esta solicitud lo antes posible. ¡Gracias! 🙌
    `;

  console.log(message);
  //  await sendMesssage(admin.phone, message);
  })


  res.json(response);

})

app.post("/relation", async (req, res) => {
  const dataBase = new PrismaClient();
  const {admin_id, yonke_id} = req.body;

  const response = await dataBase.admin_yonke.create({
    data: {
      admin_id: admin_id,
      yonke_id: yonke_id
    }
  })
  res.json(response);
})

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
