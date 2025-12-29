"use client";
import React, { useState, useEffect } from 'react';

export default function Home() {
  const DATA_COUNT = 100;
  // 2つのアルゴリズムで「全く同じ初期データ」を使うのが公正な比較（PMの基本！）
  const [initialArray, setInitialArray] = useState<number[]>([]);
  const [bubbleArray, setBubbleArray] = useState<number[]>([]);
  const [mergeArray, setMergeArray] = useState<number[]>([]);
  
  const [isSorting, setIsSorting] = useState(false);
  const [bubbleMetrics, setBubbleMetrics] = useState({ time: 0, count: 0 });
  const [mergeMetrics, setMergeMetrics] = useState({ time: 0, count: 0 });
  const [bubbleComparing, setBubbleComparing] = useState<number[]>([]);
  const [mergeComparing, setMergeComparing] = useState<number[]>([]);

  const generateNewData = () => {
    const newArr = Array.from({ length: DATA_COUNT }, () => Math.floor(Math.random() * 95) + 5);
    setInitialArray(newArr);
    setBubbleArray([...newArr]);
    setMergeArray([...newArr]);
    setBubbleMetrics({ time: 0, count: 0 });
    setMergeMetrics({ time: 0, count: 0 });
  };

  useEffect(() => { generateNewData(); }, []);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // --- バブルソートの実装 ---
  const runBubble = async (arr: number[]) => {
    let count = 0;
    const start = performance.now();
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        setBubbleComparing([j, j + 1]);
        count++;
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setBubbleArray([...arr]);
          await sleep(1);
        }
      }
    }
    setBubbleMetrics({ time: Math.round(performance.now() - start), count });
    setBubbleComparing([]);
  };

  // --- マージソートの実装 ---
  const runMerge = async (arr: number[]) => {
    let count = 0;
    const start = performance.now();
    const merge = async (s: number, m: number, e: number) => {
      let l = arr.slice(s, m + 1), r = arr.slice(m + 1, e + 1);
      let i = 0, j = 0, k = s;
      while (i < l.length && j < r.length) {
        setMergeComparing([s + i, m + 1 + j]);
        count++;
        arr[k++] = l[i] <= r[j] ? l[i++] : r[j++];
        setMergeArray([...arr]);
        await sleep(1);
      }
      while (i < l.length) { arr[k++] = l[i++]; setMergeArray([...arr]); await sleep(1); }
      while (j < r.length) { arr[k++] = r[j++]; setMergeArray([...arr]); await sleep(1); }
    };
    const sort = async (s: number, e: number) => {
      if (s >= e) return;
      const m = Math.floor((s + e) / 2);
      await sort(s, m); await sort(m + 1, e); await merge(s, m, e);
    };
    await sort(0, arr.length - 1);
    setMergeMetrics({ time: Math.round(performance.now() - start), count });
    setMergeComparing([]);
  };

  const startBattle = () => {
    setIsSorting(true);
    // 2つの関数を「同時に」呼び出す（並列実行）
    Promise.all([runBubble([...bubbleArray]), runMerge([...mergeArray])])
      .then(() => setIsSorting(false));
  };

  return (
    <main className="p-4 max-w-6xl mx-auto font-sans bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-black text-center mb-8 text-slate-800 uppercase tracking-tighter">Algorithm Battle: n={DATA_COUNT}</h1>
      
      <div className="flex justify-center mb-8">
        <button onClick={startBattle} disabled={isSorting} className="px-12 py-4 bg-red-600 text-white rounded-full font-black text-xl shadow-xl hover:bg-red-700 transition-all disabled:opacity-30 hover:scale-105 active:scale-95">
          {isSorting ? "SORTING..." : "START BATTLE!"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side: Bubble Sort */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border-t-8 border-slate-400">
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-xl font-bold italic">Bubble Sort <span className="text-sm font-normal text-slate-400">$O(n^2)$</span></h2>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400">TIME</p>
              <p className="font-mono text-xl">{bubbleMetrics.time}ms</p>
            </div>
          </div>
          <div className="flex items-end h-48 gap-[1px] bg-slate-50 p-2 rounded border border-slate-100">
            {bubbleArray.map((v, i) => (
              <div key={i} style={{ height: `${v}%` }} className={`flex-1 ${bubbleComparing.includes(i) ? 'bg-red-500' : 'bg-slate-400'}`} />
            ))}
          </div>
        </div>

        {/* Right Side: Merge Sort */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border-t-8 border-indigo-600">
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-xl font-bold italic text-indigo-600">Merge Sort <span className="text-sm font-normal text-slate-400">$O(n \log n)$</span></h2>
            <div className="text-right text-indigo-600">
              <p className="text-[10px] font-bold opacity-60">TIME</p>
              <p className="font-mono text-xl">{mergeMetrics.time}ms</p>
            </div>
          </div>
          <div className="flex items-end h-48 gap-[1px] bg-indigo-50 p-2 rounded border border-indigo-100">
            {mergeArray.map((v, i) => (
              <div key={i} style={{ height: `${v}%` }} className={`flex-1 ${mergeComparing.includes(i) ? 'bg-red-500' : 'bg-indigo-600'}`} />
            ))}
          </div>
        </div>
      </div>

      <button onClick={generateNewData} disabled={isSorting} className="block mx-auto mt-10 text-slate-400 hover:text-slate-600 underline text-sm">Reset New Dataset</button>
    </main>
  );
}