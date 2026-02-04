import React from 'react';
import { motion } from 'framer-motion';
import { Grid3X3, LayoutGrid } from 'lucide-react';
import { ViewMode } from '../../types';

interface ViewToggleProps {
    viewMode: ViewMode;
    onViewChange: (mode: ViewMode) => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, onViewChange }) => {
    return (
        <div className="flex items-center glass rounded-xl p-1">
            <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => onViewChange('grid')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
          ${viewMode === 'grid'
                        ? 'bg-gradient-primary text-white shadow-glow-sm'
                        : 'text-dark-400 hover:text-white'
                    }`}
            >
                <Grid3X3 size={18} />
                <span className="hidden sm:inline">Grid</span>
            </motion.button>

            <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => onViewChange('tile')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
          ${viewMode === 'tile'
                        ? 'bg-gradient-primary text-white shadow-glow-sm'
                        : 'text-dark-400 hover:text-white'
                    }`}
            >
                <LayoutGrid size={18} />
                <span className="hidden sm:inline">Tiles</span>
            </motion.button>
        </div>
    );
};

export default ViewToggle;
