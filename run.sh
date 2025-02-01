#!/bin/bash
PORT=8000

# Kill existing server if any
pkill -f "python3 -m http.server $PORT"

# Start server
python3 -m http.server $PORT &> /dev/null &
SERVER_PID=$!

# Verify server started
if ! ps -p $SERVER_PID > /dev/null; then
    echo "Failed to start server on port $PORT"
    exit 1
fi

# Wait for server to start
sleep 2

# Open browser
if [[ "$OSTYPE" == "darwin"* ]]; then
    open "http://localhost:$PORT"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open "http://localhost:$PORT"
else
    echo "Please open http://localhost:$PORT in your browser"
fi

# Cleanup on exit
#trap "kill $SERVER_PID 2> /dev/null" EXIT
#wait 