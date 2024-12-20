import { Server } from 'socket.io';
import  ProductManager  from '../managers/ProductManager.js';

const productManager = new ProductManager();

export const config = (httpServer) => {
    const socketServer = new Server(httpServer);

    socketServer.on('connection', async (socket) => {
        socketServer.emit('products-list', { products: await productManager.getAll() });
        socket.on('new-product', async (data) => {
            try {
                await productManager.createOne(data);
                socketServer.emit('products-list', { products: await productManager.getAll() });
            } catch (error) {
                socketServer.emit('error-message', { message: error.message });
            }
        });

        socket.on('delete-product', async (data) => {
            try {
                await productManager.deleteById(data.id);
                socketServer.emit('products-list', { products: await productManager.getAll() });
            } catch (error) {
                socketServer.emit('error-message', { message: error.message });
            }
        });
    });
};

