'use client'

import { motion } from 'framer-motion'

const networks = [
  {
    name: 'Solana',
    emoji: '🟣',
    title: 'High-Speed Blockchain',
    description: 'High-throughput blockchain for instant, low-cost payments. 65k TPS, <0.001 SOL fees.',
    features: ['65,000 TPS', '<0.001 SOL fees', 'Sub-second finality', 'Eco-friendly'],
    buttonText: 'Explore Solana',
    buttonClass: 'btn-primary',
  },
  {
    name: 'Base',
    emoji: '🔵',
    title: 'Ethereum L2 by Coinbase',
    description: 'Ethereum L2 by Coinbase for secure, scalable DeFi payments. Unlimited scale, gas-optimized.',
    features: ['Unlimited scale', 'Gas-optimized', 'Ethereum security', 'Coinbase backed'],
    buttonText: 'Explore Base',
    buttonClass: 'btn-secondary',
  },
]

export default function Networks() {
  return (
    <section className="py-20 bg-base-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Powered by Leading Networks
          </h2>
          <p className="text-xl text-secondary max-w-3xl mx-auto">
            Built on the most advanced blockchain networks for maximum performance and security.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {networks.map((network, index) => (
            <motion.div
              key={network.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="card-body p-8">
                <div className="flex items-center mb-6">
                  <div className="text-6xl mr-4">{network.emoji}</div>
                  <div>
                    <h3 className="card-title text-2xl font-bold text-primary mb-2">
                      {network.name}
                    </h3>
                    <p className="text-secondary font-medium">{network.title}</p>
                  </div>
                </div>
                
                <p className="text-secondary mb-6 leading-relaxed">
                  {network.description}
                </p>
                
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {network.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="badge badge-outline badge-primary">
                      {feature}
                    </div>
                  ))}
                </div>
                
                <motion.button 
                  className={`btn ${network.buttonClass} btn-lg`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  {network.buttonText}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
