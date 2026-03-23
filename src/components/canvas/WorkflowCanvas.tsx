"use client";

import { useCallback, useRef } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  type Connection,
  type NodeTypes,
  type OnConnectStartParams,
} from "reactflow";
import "reactflow/dist/style.css";

import { useWorkflowStore } from "@/store/workflow-store";
import { TextNode } from "@/components/nodes/TextNode";
import { UploadImageNode } from "@/components/nodes/UploadImageNode";
import { UploadVideoNode } from "@/components/nodes/UploadVideoNode";
import { LLMNode } from "@/components/nodes/LLMNode";
import { CropImageNode } from "@/components/nodes/CropImageNode";
import { ExtractFrameNode } from "@/components/nodes/ExtractFrameNode";
import { isValidConnection } from "@/lib/dag-validator";
import type { NodeType, WorkflowNode } from "@/lib/types";

const nodeTypes: NodeTypes = {
  text: TextNode,
  uploadImage: UploadImageNode,
  uploadVideo: UploadVideoNode,
  llm: LLMNode,
  cropImage: CropImageNode,
  extractFrame: ExtractFrameNode,
};

let nodeCounter = 0;

const DEFAULT_NODE_DATA: Record<NodeType, object> = {
  text: { label: "Text", status: "idle", text: "" },
  uploadImage: { label: "Upload Image", status: "idle" },
  uploadVideo: { label: "Upload Video", status: "idle" },
  llm: {
    label: "Run LLM",
    status: "idle",
    model: "gemini-2.0-flash",
    systemPrompt: "",
    userMessage: "",
  },
  cropImage: {
    label: "Crop Image",
    status: "idle",
    xPercent: 0,
    yPercent: 0,
    widthPercent: 100,
    heightPercent: 100,
  },
  extractFrame: { label: "Extract Frame", status: "idle", timestamp: 0 },
};

export function WorkflowCanvas() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    saveHistory,
  } = useWorkflowStore();

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const connectingParams = useRef<OnConnectStartParams | null>(null);

  const handleConnect = useCallback(
    (connection: Connection) => {
      const sourceNode = nodes.find((n) => n.id === connection.source);
      const targetNode = nodes.find((n) => n.id === connection.target);

      if (!sourceNode || !targetNode) return;

      // Type-safe connection validation
      const valid = isValidConnection(
        {
          nodeType: sourceNode.type ?? "",
          handleId: connection.sourceHandle ?? "output",
          dataType: "any",
        },
        {
          nodeType: targetNode.type ?? "",
          handleId: connection.targetHandle ?? "",
          dataType: "any",
        }
      );

      if (!valid) {
        console.warn("Invalid connection type — rejected");
        return;
      }

      onConnect(connection);
    },
    [nodes, onConnect]
  );

  // Drag-over handler to allow drop
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  // Drop handler: create a new node at drop position
  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const nodeType = e.dataTransfer.getData("nodeType") as NodeType;
      if (!nodeType) return;

      const wrapper = reactFlowWrapper.current;
      if (!wrapper) return;

      const bounds = wrapper.getBoundingClientRect();
      const position = {
        x: e.clientX - bounds.left - 130,
        y: e.clientY - bounds.top - 40,
      };

      saveHistory();

      const newNode: WorkflowNode = {
        id: `${nodeType}-${++nodeCounter}-${Date.now()}`,
        type: nodeType,
        position,
        data: {
          ...DEFAULT_NODE_DATA[nodeType],
        } as WorkflowNode["data"],
      };

      addNode(newNode);
    },
    [addNode, saveHistory]
  );

  return (
    <div ref={reactFlowWrapper} className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onConnectStart={(_e, params) => {
          connectingParams.current = params;
        }}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        deleteKeyCode={["Backspace", "Delete"]}
        multiSelectionKeyCode="Shift"
        snapToGrid
        snapGrid={[16, 16]}
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: "#4f46e5", strokeWidth: 2 },
        }}
        style={{ background: "#0d0d0d" }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1.5}
          color="#2a2a2a"
        />
        <Controls
          style={{ bottom: 80, left: 12 }}
          showInteractive={false}
        />
        <MiniMap
          style={{
            bottom: 12,
            right: 12,
            background: "#1a1a1a",
            border: "1px solid #2a2a2a",
          }}
          nodeColor="#6366f1"
          maskColor="rgba(0,0,0,0.6)"
        />
      </ReactFlow>
    </div>
  );
}
