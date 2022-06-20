import { Span, SpanStatusCode } from "@opentelemetry/api";
import * as opentelemetry from "@opentelemetry/api";
import {  } from "@opentelemetry/core";
import { NodeTracerProvider } from "@opentelemetry/node";
import { SimpleSpanProcessor, ConsoleSpanExporter, Tracer } from "@opentelemetry/tracing";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { B3Propagator } from "@opentelemetry/propagator-b3";
import { OTLPTraceExporter } from '@opentelemetry/exporter-otlp-grpc';
import { AsyncHooksContextManager } from '@opentelemetry/context-async-hooks'
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { registerInstrumentations } from '@opentelemetry/instrumentation';

const provider = new NodeTracerProvider({
    resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: 'api-proxy'
    })
});

provider.addSpanProcessor(new SimpleSpanProcessor(new OTLPTraceExporter()));
// provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));

const contextManager = new AsyncHooksContextManager();
contextManager.enable();

provider.register({
    propagator: new B3Propagator(),
    contextManager
});

registerInstrumentations({
    instrumentations: [
        new HttpInstrumentation({
            ignoreIncomingRequestHook: (req) => false,
            ignoreOutgoingRequestHook: (req) => true
        }),
    ],
});

const tracer = provider.getTracer('Node.js Ingress Controller');