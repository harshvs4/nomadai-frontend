# NomadAI - Intelligent Travel Planning Assistant

![NomadAI Logo](public/favicon.ico)

NomadAI is an intelligent travel planning assistant that helps users create personalized travel itineraries using AI. The application provides a seamless experience for planning trips, suggesting destinations, and creating detailed daily schedules.

## Features

- **Smart Itinerary Generation**: AI-powered travel planning that creates personalized itineraries based on user preferences
- **Real-time Flight & Hotel Data**: Integration with Amadeus API for real-time flight and hotel information
- **Destination Discovery**: Explore popular destinations with detailed information and recommendations
- **Interactive Chat Interface**: Natural language interaction with the AI assistant
- **Customizable Preferences**: Select travel preferences to get tailored recommendations
- **Detailed Daily Plans**: Comprehensive daily schedules with activities, transportation, and accommodation
- **Responsive Design**: Mobile-friendly interface for planning on the go

## Tech Stack

- **Frontend**: React.js with Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **API Integration**: 
  - Amadeus API (Flights & Hotels)
  - Google Places API (Points of Interest)
  - Custom LLM Service (Itinerary Generation)
- **Development Tools**:
  - ESLint for code linting
  - Prettier for code formatting
  - Git for version control

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- API keys for:
  - Amadeus API
  - Google Places API
  - LLM Service

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/harshvs4/nomadai-frontend.git
   cd nomadai-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory and add your API keys:
   ```
   VITE_AMADEUS_CLIENT_ID=your_amadeus_client_id
   VITE_AMADEUS_CLIENT_SECRET=your_amadeus_client_secret
   VITE_GOOGLE_PLACES_API_KEY=your_google_places_api_key
   VITE_LLM_SERVICE_URL=your_llm_service_url
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
nomadai-frontend/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images, styles, etc.
│   │   ├── chat/      # Chat interface components
│   │   ├── common/    # Shared components
│   │   ├── home/      # Home page components
│   │   └── itinerary/ # Itinerary page components
│   ├── context/       # React context providers
│   ├── hooks/         # Custom React hooks
│   ├── pages/         # Page components
│   ├── services/      # API service integrations
│   └── utils/         # Utility functions
├── .gitignore
├── package.json
├── README.md
└── tailwind.config.js
```

## Key Components

- **HomePage**: Initial landing page with travel preferences and search
- **ItineraryPage**: Detailed view of generated travel itinerary
- **ChatWindow**: Interactive chat interface with AI assistant
- **TravelForm**: Form for inputting travel preferences
- **HotelCard**: Display hotel information and options
- **FlightCard**: Display flight information
- **DailyPlan**: Detailed daily schedule view

## Team

- Gudur Venkata Rajeshwari (A0297977W)
- Harsh Sharma (A0295906N)
- Shivika Mathur (A0298106Y)
- Soumya Haridas (A0296635N)
- Vijit Daroch (A0296998R)

## API Integration

The application integrates with several APIs:

1. **Amadeus API**: For flight and hotel data
2. **Google Places API**: For points of interest and location data
3. **Custom LLM Service**: For generating personalized itineraries

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Amadeus for Travel API
- Google Places API
- OpenAI for LLM capabilities
- React and Vite communities
- Tailwind CSS team

## Contact

Harsh Sharma - [@harshvs4](https://github.com/harshvs4)

Project Link: [https://github.com/harshvs4/nomadai-frontend](https://github.com/harshvs4/nomadai-frontend) 