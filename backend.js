import express from "express";
import fs from "fs/promises";
import cors from "cors";

const app = express();
const port = 3333;

app.use(express.json());
app.use(cors());

app.listen(port, () => {
    console.log(`App is running on http://localhost:${port}`);
});

app.get("/users", async (request, response) => {
    const usersAsJSON = await fs.readFile("data.json");
    const users = JSON.parse(usersAsJSON);
    console.log(users);

    users.sort((a, b) => a.name.localeCompare(b.name));

    response.json(users);
});

app.post("/users", async (request, response) => {
    const newUser = request.body;
    newUser.id = new Date().getTime();
    console.log(newUser);

    const usersAsJSON = await fs.readFile("data.json");
    const users = JSON.parse(usersAsJSON);

    users.push(newUser);

    fs.writeFile("data.json", JSON.stringify(users));
    response.json(users);
})

app.put("/users/:id", async (request, response) => {
    const id = Number(request.params.id);

    const usersAsJSON = await fs.readFile("data.json");
    const users = JSON.parse(usersAsJSON);

    const userToUpdate = users.find(user => user.id === id);

    const body = request.body;
    console.log(body);
    //Vi opdaterer værdierne på objektet med request.body:
    userToUpdate.image = body.image;
    userToUpdate.mail = body.mail;
    userToUpdate.name = body.name;
    userToUpdate.title = body.title;

    fs.writeFile("data.json", JSON.stringify(users));
    response.json(users);
})

app.delete("/users/:id", async (request, response) => {
    const id = Number(request.params.id);
    console.log(id)

    const usersAsJSON = await fs.readFile("data.json");
    const users = JSON.parse(usersAsJSON);

    const index = users.findIndex(user => user.id === id);
    users.splice(index, 1);

    fs.writeFile("data.json", JSON.stringify(users));
    response.json(users);
})

