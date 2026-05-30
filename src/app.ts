import express, { Request, Response } from "express";
import { prisma } from "../prisma/prisma-instance";
import { errorHandleMiddleware } from "./error-handler";
import "express-async-errors";
import { createDogSchema, updateDogSchema } from "./schemas/dog.schema";
import { idSchema } from "./schemas/id.schema";
import { validateRequest } from "./middleware/validateRequest";
import { validateParams } from "./middleware/validateParams";

const app = express();
app.use(express.json());
// All code should go below this line
// EXAMPLE ENDPOINT
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello World!" });
});

// INDEX ENDPOINT
app.get("/dogs", async (req: Request, res: Response) => {
  const dogs = await prisma.dog.findMany();
  res.status(200).json(dogs);
});

// SHOW ENDPOINT WITHOUT ZOD
// app.get("/dogs/:id", async (req: Request, res: Response) => {
//   const id = Number(req.params.id);

//   if (isNaN(id)) {
//     return res.status(400).json({
//       message: "id should be a number",
//     });
//   }

//   const dog = await prisma.dog.findUnique({
//     where: {
//       id,
//     },
//   });

//   if (!dog) {
//     return res.status(204).send();
//   }

//   return res.status(200).json(dog);
// });

// SHOW ENDPOINT WITH ZOD
app.get("/dogs/:id", 
  validateParams(idSchema),
  async (req: Request, res: Response) => {
    const parsed = idSchema.safeParse(req.params);

    if (!parsed.success) {
      return res.status(400).json({
        message: parsed.error.issues[0].message,
      });
    }

    const { id } = parsed.data;
    const dog = await prisma.dog.findUnique({
      where: {
        id,
      },
    });

    if (!dog) {
      return res.status(204).send();
    }

    return res.status(200).json(dog);
  }
);

// CREATE ENDPOINT WITHOUT ZOD
// app.post("/dogs", async (req: Request, res: Response) => {
//   const errors: string[] = [];

//   const validKeys = [
//     "name",
//     "description",
//     "breed",
//     "age",
//   ];

//   for (const key of Object.keys(req.body)) {
//     if (!validKeys.includes(key)) {
//       errors.push(`'${key}' is not a valid key`);
//     }
//   }

//   if (typeof req.body.name !== "string") {
//     errors.push("name should be a string");
//   }

//   if (typeof req.body.description !== "string") {
//     errors.push("description should be a string");
//   }

//   if (typeof req.body.age !== "number") {
//     errors.push("age should be a number");
//   }

//   if (errors.length > 0) {
//     return res.status(400).json({ errors });
//   }

//   const dog = await prisma.dog.create({
//     data: {
//       name: req.body.name,
//       description: req.body.description,
//       breed: req.body.breed,
//       age: req.body.age,
//     },
//   });

//   return res.status(201).json(dog);
// });

// CREATE METHOD WITH ZOD
app.post(
  "/dogs",
  validateRequest(createDogSchema),
  async (req, res) => {
    const dog = await prisma.dog.create({
      data: req.body,
    });

    res.status(201).json(dog);
  }
);

// UPDATE ENDPOINT WITHOUT ZOD
// app.patch("/dogs/:id", async (req: Request, res: Response) => {
//   const errors: string[] = [];

//   const validKeys = [
//     "name",
//     "description",
//     "breed",
//     "age",
//   ];

//   for (const key of Object.keys(req.body)) {
//     if (!validKeys.includes(key)) {
//       errors.push(`'${key}' is not a valid key`);
//     }
//   }

//   if (errors.length > 0) {
//     return res.status(400).json({ errors });
//   }

//   const updatedDog = await prisma.dog.update({
//     where: {
//       id: Number(req.params.id),
//     },
//     data: req.body,
//   });

//   return res.status(201).json(updatedDog);
// });

// UPDATE METHOD WITH ZOD
app.patch("/dogs/:id", 
  validateRequest(updateDogSchema),
  async (req: Request, res: Response) => {
    const updatedDog = await prisma.dog.update({
      where: {
        id: Number(req.params.id),
      },
      data: req.body,
    });
    res.status(201).json(updatedDog);
  }
);

// DELETE ENDPOINT WITHOUT ZOD
// app.delete("/dogs/:id", async (req: Request, res: Response) => {
//   const id = Number(req.params.id);

//   if (isNaN(id)) {
//     return res.status(400).json({
//       message: "id should be a number",
//     });
//   }

//   const dog = await prisma.dog.findUnique({
//     where: {
//       id,
//     },
//   });

//   if (!dog) {
//     return res.status(204).send();
//   }

//   await prisma.dog.delete({
//     where: {
//       id,
//     },
//   });

//   return res.status(200).json(dog);
// });

// DELETE ENDPOINT WITH ZOD
app.delete("/dogs/:id", 
  validateParams(idSchema),
  async (req: Request, res: Response) => {
    const parsed = idSchema.safeParse(req.params);

    if (!parsed.success) {
      return res.status(400).json({
        message: parsed.error.issues[0].message,
      });
    }

    const { id } = parsed.data;
    const dog = await prisma.dog.findUnique({
      where: {
        id,
      },
    });

    if (!dog) {
      return res.status(204).send();
    }

    await prisma.dog.delete({
      where: {
        id,
      },
    });

    return res.status(200).json(dog);
  }
);


// all your code should go above this line
app.use(errorHandleMiddleware);

const port = process.env.NODE_ENV === "test" ? 3001 : 3000;
app.listen(port, () =>
  console.log(`
🚀 Server ready at: http://localhost:${port}
`),
);
