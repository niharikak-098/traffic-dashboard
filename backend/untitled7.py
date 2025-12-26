# This script defines a cleaned, modular, and runnable version of the
# reinforcement learning traffic signal agent.

# ==================== 1. IMPORTS ====================
import numpy as np
import random
import time
import pandas as pd
# Other libraries like gym, cv2, and matplotlib are not used in this
# simplified example but are included for context.
import gym
import cv2
import matplotlib.pyplot as plt

# ==================== 2. HYPERPARAMETERS ====================
# Define all key variables and hyperparameters at the top of the script
# for easy modification and clarity.

# The number of episodes to run the simulation for.
EPISODES = 10  # For quick testing

# RL Parameters
STATE_SPACE_SIZE = 500  # The number of possible states in the environment.
ACTIONS = [0, 1]        # Possible actions: 0=RED, 1=GREEN
EPSILON = 0.9           # The exploration rate for the agent (ε).
ALPHA = 0.5             # The learning rate for the agent (α).
GAMMA = 0.9             # The discount factor for future rewards (γ).

# ==================== 3. ENVIRONMENT AND AGENT CLASSES ====================

class TrafficEnvironment:
    """
    Simulates the traffic environment with a simple state and step function.
    """
    def __init__(self):
        # The state represents the current number of detected vehicles.
        self.state = 0
        self.max_vehicles = 100 # Maximum vehicle count for state scaling

    def reset(self):
        """Resets the environment to an initial state."""
        self.state = 0
        return self.state

    def step(self, action):
        """
        Takes a single step in the environment based on the agent's action.
        
        This is a placeholder for a more complex simulation.
        
        :param action: The action chosen by the agent (0 or 1).
        :return: A tuple containing the next state and the reward.
        """
        # A simple reward function: reward is higher if the action is green (1)
        # and there are many vehicles.
        reward = action * (self.state / self.max_vehicles)
        
        # Next state is a random change in vehicle count, simulating new arrivals.
        next_state = self.state + random.randint(-5, 10)
        next_state = max(0, min(self.max_vehicles, next_state))
        
        self.state = next_state
        
        return next_state, reward

class TrafficSignalAgent:
    """
    Implements a Q-learning agent to learn the optimal traffic signal actions.
    """
    def __init__(self, state_space_size, actions, alpha, gamma, epsilon):
        self.actions = actions
        self.alpha = alpha
        self.gamma = gamma
        self.epsilon = epsilon
        # The Q-table is a numpy array initialized with zeros.
        self.q_table = np.zeros((state_space_size, len(actions)))

    def choose_action(self, state):
        """
        Chooses an action using an epsilon-greedy policy.
        
        :param state: The current state of the environment.
        :return: The chosen action (0 or 1).
        """
        # Epsilon-greedy for exploration vs. exploitation
        if np.random.rand() < self.epsilon:
            # Explore: choose a random action
            return np.random.choice(self.actions)
        else:
            # Exploit: choose the action with the highest Q-value
            return np.argmax(self.q_table[state, :])

    def update_q_value(self, state, action, reward, next_state):
        """
        Updates the Q-value based on the Q-learning update rule.
        
        :param state: The current state.
        :param action: The action taken.
        :param reward: The reward received.
        :param next_state: The next state.
        """
        # Find the best action in the next state.
        best_next_action = np.argmax(self.q_table[next_state, :])
        
        # Q-learning formula
        td_target = reward + self.gamma * self.q_table[next_state, best_next_action]
        td_error = td_target - self.q_table[state, action]
        self.q_table[state, action] += self.alpha * td_error

# ==================== 4. MAIN SIMULATION LOOP ====================

def main():
    """
    The main function to initialize and run the RL training simulation.
    """
    # Initialize the environment and agent
    env = TrafficEnvironment()
    agent = TrafficSignalAgent(
        state_space_size=STATE_SPACE_SIZE,
        actions=ACTIONS,
        alpha=ALPHA,
        gamma=GAMMA,
        epsilon=EPSILON
    )
    
    # Store training metrics to analyze performance
    rewards_per_episode = []
    
    print("Starting RL Agent Training...")
    
    # Run the training for a number of episodes
    for episode in range(EPISODES):
        # Reset the environment for a new episode
        current_state = env.reset()
        total_reward = 0
        
        # The simulation will run for a maximum of 100 steps per episode.
        for step in range(100):
            # The agent chooses an action
            action = agent.choose_action(current_state)
            
            # The environment takes a step and returns the next state and reward
            next_state, reward = env.step(action)
            
            # The agent updates its Q-table
            agent.update_q_value(current_state, action, reward, next_state)
            
            # Update the total reward for the episode
            total_reward += reward
            
            # Move to the next state
            current_state = next_state
        
        # Log the total reward for this episode
        rewards_per_episode.append(total_reward)
        print(f"Episode: {episode + 1}/{EPISODES} | Total Reward: {total_reward:.2f}")

    print("\nTraining Finished!")
    
    # You can analyze the results here, for example by plotting the rewards.
    plt.figure(figsize=(10, 6))
    plt.plot(rewards_per_episode, color='green')
    plt.title('Agent Performance Over Episodes')
    plt.xlabel('Episode')
    plt.ylabel('Total Reward')
    plt.grid(True)
    plt.show()

# Run the main function when the script is executed
if __name__ == "__main__":
    main()
