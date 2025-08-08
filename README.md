# 🔥 Burnt Matchstick Detector

A React-based web application that detects whether a matchstick is burnt or not from uploaded images. The app features an interactive door that unlocks when a burnt matchstick is detected.

## 🎯 Features

- **Image Upload**: Drag and drop or click to upload images
- **Matchstick Detection**: Visual representation of matchstick state (burnt/unburnt)
- **Interactive Door**: 3D animated door that opens when burnt matchstick is detected
- **Malayalam Text**: Displays status messages in Malayalam
- **Modern UI**: Beautiful gradient background and smooth animations
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd burnt-matchstick-detector
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [matchstick](https://vercel.com/milens-projects-0a82689d/burnt-matchstick-detector/DHJ1QwWasf76frKTT9u6rjLeMTyL) to view it in the browser.

## 🎮 How to Use

1. **Upload an Image**: 
   - Drag and drop an image file onto the upload area
   - Or click the upload area to browse and select an image
   - Supported formats: JPG, PNG, GIF

2. **Wait for Analysis**:
   - The app will simulate image processing (2 seconds)
   - A random result will be generated for demo purposes

3. **View Results**:
   - If matchstick is detected as burnt: Door will automatically unlock after 3 seconds
   - If matchstick is unburnt: Door remains locked
   - Status messages are displayed in Malayalam

4. **Interactive Door**:
   - Click the door to manually toggle its state
   - Door has smooth 3D rotation animation

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Matchstick.js          # Matchstick visualization component
│   ├── Matchstick.css         # Matchstick styles
│   ├── UploadSection.js       # Image upload component
│   ├── UploadSection.css      # Upload section styles
│   ├── Door.js               # Interactive door component
│   └── Door.css              # Door styles
├── App.js                    # Main application component
├── App.css                   # Main application styles
└── index.js                  # Application entry point
```

## 🎨 Components

### Matchstick Component
- Displays animated matchstick state
- Shows burnt/unburnt status in Malayalam
- Automatically hides after 2 seconds when burnt

### UploadSection Component
- Drag and drop file upload
- Image preview functionality
- File type validation
- Responsive design

### Door Component
- 3D animated door with rotation
- Interactive click to toggle
- Visual feedback for open/closed states

## 🔧 Customization

### Adding Real Detection Logic
To implement actual image detection, replace the random logic in `App.js`:

```javascript
const handleImageUpload = (file) => {
  setUploadedImage(file);
  // Add your image processing logic here
  // Example: Call an AI/ML API for detection
  processImage(file).then(result => {
    setIsBurnt(result.isBurnt);
    if (result.isBurnt) {
      setTimeout(() => setIsDoorOpen(true), 3000);
    }
  });
};
```

### Styling
- Modify CSS files in the `components/` directory
- Update color schemes in `App.css`
- Customize animations and transitions

## 🐛 Troubleshooting

### Common Issues

1. **Images not loading**: Ensure image files are in the correct format
2. **Upload not working**: Check browser console for errors
3. **Styling issues**: Clear browser cache and restart development server

### Development

- Run tests: `npm test`
- Build for production: `npm run build`
- Eject from Create React App: `npm run eject`

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and questions, please open an issue in the repository.
