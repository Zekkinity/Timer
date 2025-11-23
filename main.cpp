#include <chrono>
#include <iostream>
#include <queue>
#include <thread>

int main() {
    int currentTime = 0;

    std::queue<int> timers;
    int timerDuration;

    const int MAX_TIMERS = 3;

    for (int i = 0; i < MAX_TIMERS; i++) {
        // Get user input
        std::cout << "Enter the timer duration: ";
        std::cin >> timerDuration;

        if (timerDuration == 0) {
            break;
        }

        timers.push(timerDuration);
    }

    while (true) {
        if (timers.empty()) {
            std::cout << "No timers left" << std::endl;
            break;
        }

        std::this_thread::sleep_for(std::chrono::seconds(1));
        currentTime++;
        std::cout << "Time: " << currentTime << std::endl;

        timerDuration = timers.front();

        // Run timers
        if (currentTime == timerDuration) {
            std::cout << "Timer expired" << std::endl;
            currentTime = 0;
            timers.pop();
        }

    }

    return 0;
}
