import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";

const Header = ({ 
  title, 
  searchValue, 
  onSearchChange, 
  onAddClick, 
  addButtonText = "Add New",
  showSearch = true,
  showAddButton = true,
  onMenuClick 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white shadow-sm border-b border-gray-200 px-6 py-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ApperIcon name="Menu" className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-display">{title}</h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {showSearch && (
            <SearchBar
              value={searchValue}
              onChange={onSearchChange}
              placeholder={`Search ${title.toLowerCase()}...`}
              className="w-64 hidden sm:block"
            />
          )}
          
          {showAddButton && (
            <Button onClick={onAddClick} className="flex items-center space-x-2">
              <ApperIcon name="Plus" className="w-4 h-4" />
              <span className="hidden sm:inline">{addButtonText}</span>
            </Button>
          )}

          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
              <ApperIcon name="Bell" className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">T</span>
            </div>
          </div>
        </div>
      </div>

      {showSearch && (
        <div className="mt-4 sm:hidden">
          <SearchBar
            value={searchValue}
            onChange={onSearchChange}
            placeholder={`Search ${title.toLowerCase()}...`}
          />
        </div>
      )}
    </motion.div>
  );
};

export default Header;