export function Aside() {
  return (
    <aside className="w-60 min-w-[240px] h-[100%] bg-dark p-4">
      <div className="text-[white] pl-4 pt-2 pb-2 rounded-[6px] cursor-pointer font-mono flex align-middle items-center hover:bg-black">
        <i className="text-[20px] ri-chat-history-line" />
        <p className="ml-2">History</p>
      </div>
      <div className="text-[white] pl-4 pt-2 pb-2 rounded-[6px] cursor-pointer font-mono flex align-middle items-center hover:bg-black">
        <i className="text-[20px] ri-task-line"></i>
        <p className="ml-2">Tasks</p>
      </div>
    </aside>
  );
}
