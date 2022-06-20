import { trace, context, SpanStatusCode, Span } from '@opentelemetry/api';

export function tracedAsyncMethod()
{
    return <TArgs extends any[], TReturn>(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<(...args: TArgs) => Promise<TReturn>>) =>
    {
        let spanName = `${target.constructor.name}.${propertyKey}`;
        if (descriptor.value)
        {
            let originalMethod = descriptor.value;
            descriptor.value = function (...args) {
                return tracer.startActiveSpan(spanName, async (span) => {
                    try
                    {
                        return await originalMethod.apply(this, args);
                    }
                    catch (e)
                    {
                        span.recordException(e);
                        throw e;
                    }
                    finally
                    {
                        span.end();
                    }
                });
            };
        }
    };
}

export const tracer = trace.getTracer('api-proxy');
