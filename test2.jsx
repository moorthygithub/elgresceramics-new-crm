{
  /* <div className="w-full sm:w-96 mb-6">
          <label className="block mb-2 font-semibold text-sm text-gray-700 dark:text-gray-200">
            Available Between: <span className="text-blue-600">{range[0]}</span>{" "}
            – <span className="text-blue-600">{range[1]}</span>
          </label>

          <div
            className="relative h-4 flex items-center cursor-pointer"
            ref={sliderTrackRef}
            onClick={handleTrackClick}
          >
            <div className="absolute top-1/2 -translate-y-1/2 w-full h-1 bg-gray-300 rounded-full" />

            <div
              className="absolute top-1/2 -translate-y-1/2 h-1 bg-blue-500 rounded-full"
              style={{
                left: `${
                  ((range[0] - minTotal) / (maxTotal - minTotal)) * 100
                }%`,
                width: `${
                  ((range[1] - range[0]) / (maxTotal - minTotal)) * 100
                }%`,
              }}
            />

            <input
              type="range"
              min={minTotal}
              max={maxTotal}
              value={range[0]}
              onChange={(e) => {
                const newStart = Math.min(Number(e.target.value), range[1]);
                setRange([Math.max(minTotal, newStart), range[1]]);
              }}
              className="absolute w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto"
            />

            <input
              type="range"
              min={minTotal}
              max={maxTotal}
              value={range[1]}
              onChange={(e) => {
                const newEnd = Math.max(Number(e.target.value), range[0]);
                setRange([range[0], Math.min(maxTotal, newEnd)]);
              }}
              className="absolute w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto"
            />
          </div>

          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>{minTotal}</span>
            <span>{maxTotal}</span>
          </div>

          <button
            onClick={() => setRange([minTotal, maxTotal])}
            className="mt-2 text-sm text-blue-600 hover:underline"
          >
            Reset Range
          </button>
        </div> */
}
{
  /* <div className="w-full sm:w-96 mb-6 select-none font-sans">
          <div className="flex justify-center">
            <div className="flex justify-between w-full max-w-md items-center">
              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-200">
                  Available Between:{" "}
                  <span className="text-blue-600 font-mono">{range[0]}</span> –{" "}
                  <span className="text-blue-600 font-mono">{range[1]}</span>
                </label>
              </div>
              <button
                onClick={() => setRange([minTotal, maxTotal])}
                className="text-sm text-blue-600 hover:underline"
              >
                Reset Range
              </button>
            </div>
          </div>

          <div
            className="relative h-10 flex items-center cursor-pointer"
            ref={sliderTrackRef}
            onClick={handleTrackClick}
          >
            <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-300 rounded-full -translate-y-1/2" />
            <div
              className="absolute top-1/2 h-2 bg-blue-600 rounded-full -translate-y-1/2 transition-all duration-150 ease-in-out"
              style={{
                left: `${
                  ((range[0] - minTotal) / (maxTotal - minTotal)) * 100
                }%`,
                width: `${
                  ((range[1] - range[0]) / (maxTotal - minTotal)) * 100
                }%`,
              }}
            />
            <input
              type="range"
              min={minTotal}
              max={maxTotal}
              value={range[0]}
              onChange={(e) => {
                const val = Math.min(Number(e.target.value), range[1]);
                setRange([Math.max(minTotal, val), range[1]]);
              }}
              className="absolute w-full h-10 appearance-none bg-transparent pointer-events-none"
              style={{ zIndex: range[0] === range[1] ? 5 : 3 }}
            />
            <div
              className="absolute top-1/2 rounded-full bg-white border-4 border-blue-600 w-6 h-6 shadow-lg -translate-y-1/2 pointer-events-auto cursor-pointer hover:scale-110 transition-transform"
              style={{
                left: `${
                  ((range[0] - minTotal) / (maxTotal - minTotal)) * 100
                }%`,
                transform: "translate(-50%, -50%)",
                zIndex: 10,
              }}
            />

            <input
              type="range"
              min={minTotal}
              max={maxTotal}
              value={range[1]}
              onChange={(e) => {
                const val = Math.max(Number(e.target.value), range[0]);
                setRange([range[0], Math.min(maxTotal, val)]);
              }}
              className="absolute w-full h-10 appearance-none bg-transparent pointer-events-none"
              style={{ zIndex: 4 }}
            />
            <div
              className="absolute top-1/2 rounded-full bg-white border-4 border-blue-600 w-6 h-6 shadow-lg -translate-y-1/2 pointer-events-auto cursor-pointer hover:scale-110 transition-transform"
              style={{
                left: `${
                  ((range[1] - minTotal) / (maxTotal - minTotal)) * 100
                }%`,
                transform: "translate(-50%, -50%)",
                zIndex: 10,
              }}
            />
          </div>

          <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono">
            <span>{minTotal}</span>
            <span>{maxTotal}</span>
          </div>
        </div> */
}
