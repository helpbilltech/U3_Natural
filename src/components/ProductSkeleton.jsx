import React from 'react';
import { motion } from 'framer-motion';

export default function ProductSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className="bg-white rounded-3xl p-6 shadow-lg border border-[#f0f0f0]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
        >
          <div className="animate-pulse">
            <div className="bg-gray-200 rounded-2xl mb-5 flex items-center justify-center" style={{ height: 200 }}></div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="flex items-center justify-between pt-2">
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                <div className="h-10 bg-gray-200 rounded-full w-24"></div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}