const request = require('supertest');
const app = require('../server');
const axios = require('axios');

//mocks
jest.mock('axios');

describe("GET /movie/:id", () => {
    it("should return movie details from API", async () => {
        
        const mockMovieResponse = {
            data: {
                id: 1234,
                title: 'Fake Movie',
                overview: 'A fake movie for testing',
                release_date: '2025-01-01'
            }
        };

        axios.get.mockResolvedValue(mockMovieResponse);

        const response = await request(app).get(`/movie/1234`);

        console.log(response.text); 
        expect(response.status).toBe(200);
        expect(response.text).toContain("Fake Movie");
        expect(axios.get).toHaveBeenCalledWith(
            `https://api.themoviedb.org/3/movie/1234`,
            expect.objectContaining({
              params: { api_key: process.env.API_KEY }
            })
          );
    });
});

