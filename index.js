import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import { sendMessage } from "./services/whatsappService.js";
import { getUsers, login, register } from "./src/auth.js";
import { getUserQuestions } from "./src/questions.js";
dotenv.config();
const dataBase = new PrismaClient();
const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("SI SIRVEEEEE");
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
  console.log(body);
  if (!body.admin_id) return res.json({ message: "no hay" });

  const newYonke = await dataBase.yonke.create({
    data: {
      name: body.name,
      location: body.location,
      city: body.city,
      latitude: body.latitude,
      longitude: body.longitude,
    },
  });
  console.log({ newYonke });
  const user = await dataBase.user.update({
    where: {
      id: body.admin_id,
    },
    data: {
      role: ["ADMIN"],
    },
  });

  console.log({ user });

  const relation = await dataBase.admin_yonke.create({
    data: {
      admin_id: body.admin_id,
      yonke_id: newYonke.id,
    },
  });

  console.log({ relation });

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
//
app.post("/question", async (req, res) => {
  try {
    const {
      cities,
      name,
      phoneNumber,
      pieceName,
      carBrand,
      carModelYear,
      carEngine,
      userId,
    } = req.body;

    console.log("------------------------", cities, "------------------------");
    console.log("------------------------", userId, "------------------------");
    let admins = [];
    const yonkes = await dataBase.yonke.findMany({
      where: { city: { in: cities } },
      include: {
        admin_yonkes: {
          include: { admin: true },
        },
      },
    });
    console.log({ yonkes });
    if (yonkes.length === 0) {
      return res.status(404).json({
        message: "No se encontraron yonkes en las ciudades seleccionadas",
      });
    }
    const response = yonkes.map((yonke) => {
      const yonkemap = {
        name: yonke.name,
        location: yonke.location,
        city: yonke.city,
        latitude: yonke.latitude,
        longitude: yonke.longitude,
        admins: yonke.admin_yonkes.map((admin) => {
          const adminmap = { name: admin.admin.name, phone: admin.admin.phone };
          admins.push(adminmap);
          return adminmap;
        }),
      };
      return yonkemap;
    });
    console.log("YONKES ENCONTRADOS", { response });

    if (userId) {
      const user = await dataBase.user.findUnique({
        where: { id: userId },
      });
      if (user) {
        console.log(
          "------------------------",
          user.name,
          "------------------------"
        );
        const question = await dataBase.question.create({
          data: {
            name,
            pieceName,
            cities,
            carBrand,
            phoneNumber,
            carModelYear,
            carEngine,
            User: { connect: { id: user.id } },
          },
        });
        console.log({ question });
      }
    }

    for (const admin of admins) {
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
      console.log({ message });
      await sendMessage(admin.phone, message);
    }

    res.json(response);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Ocurrió un error en el servidor" });
  } finally {
    await dataBase.$disconnect(); // Cerrar conexión correctamente
  }
});

app.get("/questions", async (req, res) => getUserQuestions(req, res));

//
app.post("/relation", async (req, res) => {
  const dataBase = new PrismaClient();
  const { admin_id, yonke_id } = req.body;

  const response = await dataBase.admin_yonke.create({
    data: {
      admin_id: admin_id,
      yonke_id: yonke_id,
    },
  });
  res.json(response);
});

app.post("/login", async (req, res) => login(req, res));

app.post("/register", async (req, res) => register(req, res));

app.get("/users", async (req, res) => getUsers(req, res));

//
app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
