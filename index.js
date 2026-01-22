require('dotenv').config()
const mariadb = require('mariadb');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));


const pool = mariadb.createPool({
    host: process.env.DB_HOST, 
    port: process.env.DB_PORT,
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 5
});


const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));



// APIS
// Ruta Raiz
// app.get('/', async (req,res) => {
//     res.send('¡Bienvenido a la API!');
// });

// CREAR USUARIO
app.post('/usuarios', async (req, res) => {
    let conn;

    try {
        const { nombre, apellidos, sexo, edad, telefono } = req.body;
        conn = await pool.getConnection();

        const result = await conn.query(
            "INSERT INTO usuarios (nombre, apellidos, sexo, edad, telefono) VALUES (?, ?, ?, ?, ?)",
            [nombre, apellidos, sexo, edad, telefono]
        );

        res.status(201).json({
            message: "Usuario creado con éxito",
            id: Number(result.insertId) // insertId contiene el nuevo ID auto-incremental
        });

    } catch (err) {
        res.status(500).send(err.message);

    } finally {
        if (conn) conn.release();
    }
});

// CREAR GRUPO
app.post('/grupos', async (req, res) => {
    let conn;

    try {
        const { nombre } = req.body;
        conn = await pool.getConnection();

        const result = await conn.query(
            "INSERT INTO grupos (nombre) VALUES (?)", [nombre]
        );

        res.status(201).json({
            message: "Grupo creado con éxito",
            id: Number(result.insertId) // insertId contiene el nuevo ID auto-incremental
        });

    } catch (err) {
        res.status(500).send(err.message);

    } finally {
        if (conn) conn.release();
    }
});

// LEER USUARIOS
app.get('/usuarios', async (req, res) => {
    let conn;

    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM usuarios");
        res.json(rows);

    } catch (err) {
        res.status(500).send(err.message);

    } finally {
        if (conn) conn.release();
    }
});

// LEER USUARIO:ID
app.get('/usuarios/:id', async (req, res) => {
    let conn;

    try {
        const { id } = req.params;
        conn = await pool.getConnection();
        
        const rows = await conn.query("SELECT * FROM usuarios WHERE id = ?", [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" }); // Manejo de caso no existente
        }

        res.json(rows[0]); // Retornamos solo el primer objeto del array

    } catch (err) {
        res.status(500).send(err.message);

    } finally {
        if (conn) conn.release();
    }
});

// LEER GRUPOS
app.get('/grupos', async (req, res) => {
    let conn;

    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM grupos");
        res.json(rows);

    } catch (err) {
        res.status(500).send(err.message);

    } finally {
        if (conn) conn.release();
    }
});

// LEER GRUPO:ID
app.get('/grupos/:id', async (req, res) => {
    let conn;

    try {
        const { id } = req.params;
        conn = await pool.getConnection();
        
        const rows = await conn.query("SELECT * FROM grupos WHERE id = ?", [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Grupo no encontrado" }); // Manejo de caso no existente
        }

        res.json(rows[0]); // Retornamos solo el primer objeto del array

    } catch (err) {
        res.status(500).send(err.message);

    } finally {
        if (conn) conn.release();
    }
});

// ACTUALIZAR USUARIO:ID
app.put('/usuarios/:id', async (req, res) => {
    let conn;

    try {
        const { id } = req.params;
        const { nombre, apellidos, sexo, edad, telefono } = req.body;

        conn = await pool.getConnection();

        const result = await conn.query(
            "UPDATE usuarios SET nombre = ?, apellidos = ?, sexo = ?, edad = ?, telefono = ? WHERE id = ?",
            [nombre, apellidos, sexo, edad, telefono, id]
        );

        // Verificar si el registro existía
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.json({ message: `Usuario con ID ${id} actualizado correctamente` });

    } catch (err) {
        res.status(500).send(err.message);

    } finally {
        if (conn) conn.release();
    }
});

// ACTUALIZAR GRUPO:ID
app.put('/grupos/:id', async (req, res) => {
    let conn;

    try {
        const { id } = req.params;
        const { nombre } = req.body;

        conn = await pool.getConnection();

        const result = await conn.query(
            "UPDATE grupos SET nombre = ? WHERE id = ?", [nombre, id]
        );

        // Verificar si el registro existía
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Grupo no encontrado" });
        }

        res.json({ message: `Grupo con ID ${id} actualizado correctamente` });

    } catch (err) {
        res.status(500).send(err.message);

    } finally {
        if (conn) conn.release();
    }
});

// BORRAR USUARIO:ID
app.delete('/usuarios/:id', async (req, res) => {
    let conn;

    try {
        const { id } = req.params;
        conn = await pool.getConnection();

        const result = await conn.query("DELETE FROM usuarios WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "No se encontró el usuario para eliminar" });
        }

        res.json({ message: `Usuario con ID ${id} eliminado correctamente` });

    } catch (err) {
        res.status(500).send(err.message);

    } finally {
        if (conn) conn.release();
    }
});

// BORRAR GRUPO:ID
app.delete('/grupos/:id', async (req, res) => {
    let conn;

    try {
        const { id } = req.params;
        conn = await pool.getConnection();

        const result = await conn.query("DELETE FROM grupos WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "No se encontró el grupo solicitado" });
        }

        res.json({ message: `Grupo con ID ${id} eliminado correctamente` });

    } catch (err) {
        res.status(500).send(err.message);

    } finally {
        if (conn) conn.release();
    }
});


// COMPROBADOR CONEXIÓN...
async function waitForDB() {
    let connected = false;
    console.log("Esperando a que MariaDB esté lista...");

    while (!connected) {
        try {
            const conn = await pool.getConnection();
            await conn.ping();
            conn.release();
            connected = true;
            console.log("MariaDB está lista.");

        } catch (err) {
            console.log("MariaDB no está lista. Reintentando en 2 segundos..." + `\n
                host: ${process.env.DB_HOST}, 
                port: ${process.env.DB_PORT},
                user: ${process.env.DB_USER}, 
                password: ${process.env.DB_PASSWORD},
                database: ${process.env.DB_NAME}`);
            await new Promise(res => setTimeout(res, 2000));
        }
    }
}

waitForDB();

async function startDatabase() {
    let conn;

    try {
        conn = await pool.getConnection();
        // COMENTADAS PARA CREAR BD DESDE COOLIFY
        // await conn.query("CREATE DATABASE IF NOT EXISTS centro;");
        // await conn.query("USE centro;");
        await conn.query("CREATE TABLE IF NOT EXISTS usuarios (id INT AUTO_INCREMENT PRIMARY KEY, nombre VARCHAR(50) NOT NULL, apellidos VARCHAR(50) NOT NULL, sexo VARCHAR(50) NOT NULL, edad VARCHAR(50) NOT NULL, telefono VARCHAR(50) NOT NULL);");
        await conn.query("CREATE TABLE IF NOT EXISTS grupos (id INT AUTO_INCREMENT PRIMARY KEY, nombre VARCHAR(50) NOT NULL);");

        // await conn.query("CREATE TABLE IF NOT EXISTS users_groups (user_id INT NOT NULL, group_id INT NOT NULL, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE, FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE ON UPDATE CASCADE);")

    } catch (error) {
        console.log(`Ha habido un error al inicializar la base de datos: ${error}`);

    } finally {
        if (conn) conn.release();
    }
}

waitForDB().then(() => startDatabase());
