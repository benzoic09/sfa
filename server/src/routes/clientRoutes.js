import express from "express";
import { getClients } from "../controllers/clientController";

// Route to create a new customer
//router.post("/client", createClient);

// Route to get all customer
router.get("/client", getClients);
