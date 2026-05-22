import { ArrowLeft } from "lucide-react";

export function AssignmentList() {
  return (
    <div className="w-full max-w-[1100px] mx-auto md:bg-white md:rounded-2xl md:p-6 md:shadow-sm min-h-[500px]">
      
      {/* Mobile Title Area */}
      <div className="flex md:hidden relative items-center justify-center w-full h-[50px] mb-4">
        <button className="absolute left-[10px] w-10 h-10 bg-black/5 hover:bg-black/10 rounded-full flex items-center justify-center text-gray-700 transition-colors">
          <ArrowLeft size={20} strokeWidth={2} />
        </button>
        <h2 
          className="text-gray-900 font-[family-name:var(--font-bricolage)] text-center align-middle"
          style={{
            fontWeight: 700,
            fontSize: '18px',
            lineHeight: '140%',
            letterSpacing: '-0.04em'
          }}
        >
          Assignments
        </h2>
      </div>

      {/* Desktop Title Area (Frame 1984077332) */}
      <div className="hidden md:flex flex-row items-center w-full h-[50px] px-[8px] gap-[16px]">
        
        {/* Left Icon */}
        <div className="flex items-center justify-center w-8 h-8 bg-green-50 rounded-lg">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>

        {/* Text Container */}
        <div className="flex flex-col justify-center">
          <h2 
            className="text-gray-900 font-[family-name:var(--font-bricolage)] text-left align-middle"
            style={{
              fontWeight: 700,
              fontSize: '20px',
              lineHeight: '140%',
              letterSpacing: '-0.04em'
            }}
          >
            Assignments
          </h2>
          <p className="text-sm text-gray-500 leading-tight mt-1">Manage and create assignments for your classes.</p>
        </div>
        
      </div>
      
      {/* Divider */}
      <hr className="hidden md:block my-4 border-gray-200" />
      
      {/* Search and Filter area will go here */}
      
    </div>
  );
}
