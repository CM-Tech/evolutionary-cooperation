
""" Neural Network.
A 2-Hidden Layers Fully Connected Neural Network (a.k.a Multilayer Perceptron)
implementation with TensorFlow. This example is using the MNIST database
of handwritten digits (http://yann.lecun.com/exdb/mnist/).
Links:
    [MNIST Dataset](http://yann.lecun.com/exdb/mnist/).
Author: Aymeric Damien
Project: https://github.com/aymericdamien/TensorFlow-Examples/
"""

from __future__ import print_function
import tensorflow as tf

cooperation_bonus=2
cooperation_cost=1
num_input=16 #(0,1),(2,3),(4,5),(6,7),(8,9),(10,11),(12,13),(14,15) Other HISTORY (Others choice, others others choice)
# Parameters
learning_rate = 0.1
num_steps = 5000
display_step = 100

# Network Parameters
n_hidden_1 = 64 # 1st layer number of neurons
n_hidden_2 = 64 # 2nd layer number of neurons
num_classes = 2 # DEFECT OR COOPERATE


class Animal(object):
    """Animal is cool"""
    def __init__(self,parents=[]):
        super(Animal, self).__init__()
        self.brain=self.createNework(parents)

    def createNework(self,parents=[]):
        if(len(parents)<2):
            return self.randomNetwork()
        else:
            return self.randomNetwork()
    def randomNetwork(self):
        X = tf.placeholder("float", [None, num_input])
        weights = {
            'h1': tf.Variable(tf.random_normal([num_input, n_hidden_1])),
            'h2': tf.Variable(tf.random_normal([n_hidden_1, n_hidden_2])),
            'out': tf.Variable(tf.random_normal([n_hidden_2, num_classes]))
        }
        biases = {
            'b1': tf.Variable(tf.random_normal([n_hidden_1])),
            'b2': tf.Variable(tf.random_normal([n_hidden_2])),
            'out': tf.Variable(tf.random_normal([num_classes]))
        }
        layer_1 = tf.add(tf.matmul(X, weights['h1']), biases['b1'])
        # Hidden fully connected layer with 256 neurons
        layer_2 = tf.add(tf.matmul(layer_1, weights['h2']), biases['b2'])
        # Output fully connected layer with a neuron for each class
        out_layer = tf.matmul(layer_2, weights['out']) + biases['out']
        return out_layer



init = tf.global_variables_initializer()

test_animal= Animal()
# Start training
with tf.Session() as sess:

    # Run the initializer
    sess.run(init)
    print("LETS DO STUFF")
