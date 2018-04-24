/**
 * houston/src/worker/server.ts
 * A server to listen for build requests
 *
 * @exports {Class} Server
 */

import { inject } from 'inversify'

import { Config } from '../lib/config'
import { IQueue, workerQueue } from '../lib/queue'
import { Repository } from '../lib/service/base/repository'
import { Build } from './preset/build'
import { IContext, IPreset, IResult } from './type'

interface IWorkerParams { type: string, context: IContext }
type IWorkerHandler = (params: IWorkerParams) => Promise<IResult>

export class Server {
  /**
   * The application configuration
   *
   * @var {Config}
   */
  protected config: Config

  /**
   * The worker queue
   *
   * @var {IQueue}
   */
  protected queue: IQueue

  /**
   * Creates a new worker server to handle requests in the worker queue.
   *
   * @param {Config} config
   * @param {IQueue} queue - The worker queue.
   */
  constructor (@inject(Config) config: Config, @inject(workerQueue) queue: IQueue) {
    this.config = config
    this.queue = queue
  }

  public async start () {
    await this.queue.connect()

    this.queue.handle<IWorkerHandler, IResult>(async ({ type, context }) => {
      return await this.handleBuildRequest(type, context)
    })
  }

  public async stop () {
    this.queue.close()
  }

  protected async branches (repository: Repository) {
    //
  }

  /**
   * Returns the worker preset requested.
   *
   * @param {string} type
   * @throws {Error} - When an unknown type given
   */
  protected presetFactory (type: string): IPreset {
    switch (type) {
      case ('build'):
        return Build
      default:
        throw new Error('Unknown worker preset given')
    }
  }

  /**
   * Does the actual worker logic
   *
   * @async
   * @param {string} preset
   * @param {IContext} context
   * @return {IResult}
   */
  protected async handleBuildRequest (preset: string, context: IContext): Promise<IResult> {
    const presetFunction = this.presetFactory(preset)
    const worker = presetFunction(this.config, null, context)

    await worker.setup()
    await worker.run()
    await worker.teardown()

    return worker.result
  }
}
