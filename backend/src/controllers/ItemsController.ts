import {Request, Response} from 'express'
import knex from '../database/connection'

// index, show, create - store, update, delete

export default {
  async index(request: Request, response: Response) {
    const items = await knex('items').select('*')

    const serializedItems = items.map(item => {
      const {id, title, image} = item;
      return {
        id,
        title,
        image_url: `http://localhost:3333/uploads/${image}`
      }
    })

    return response.json(serializedItems);
  }
}